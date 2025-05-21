const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// Helper function to authenticate driver token
const authenticateDriverToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure this is a driver token
    if (decoded.type !== "driver") {
      return res.status(403).json({ error: "Not authorized as driver" });
    }

    req.driverId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Start a new trip - for mobile app
router.post("/start", authenticateDriverToken, async (req, res) => {
  try {
    const driverId = req.driverId;

    // Get the driver's currently assigned vehicle
    const vehicleResult = await pool.query(
      `SELECT v.id as vehicle_id, v.vehicle_number 
       FROM vehicles v 
       JOIN vehicle_driver_assignments vda ON v.id = vda.vehicle_id 
       WHERE vda.driver_id = $1 
       AND vda.id = (
         SELECT MAX(id) 
         FROM vehicle_driver_assignments 
         WHERE driver_id = $1
       )`,
      [driverId]
    );

    if (vehicleResult.rows.length === 0) {
      return res.status(400).json({ error: "No vehicle assigned to driver" });
    }

    const vehicleId = vehicleResult.rows[0].vehicle_id;
    const vehicleNumber = vehicleResult.rows[0].vehicle_number;

    // Check if driver already has an active trip
    const activeTrip = await pool.query(
      `SELECT id FROM trips 
       WHERE driver_id = $1 AND status = 'active'`,
      [driverId]
    );

    if (activeTrip.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Driver already has an active trip" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Create new trip
    const startTime = new Date();
    const tripResult = await pool.query(
      `INSERT INTO trips
        (driver_id, vehicle_id, start_time, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING id, start_time`,
      [driverId, vehicleId, startTime]
    );

    // Update vehicle's last_trip time
    await pool.query(
      "UPDATE vehicles SET last_trip = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [startTime, vehicleId]
    );

    await pool.query("COMMIT");

    // Get driver name for the socket event
    const driverResult = await pool.query(
      "SELECT name FROM drivers WHERE id = $1",
      [driverId]
    );

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    const tripEvent = {
      type: "trip_started",
      trip_id: tripResult.rows[0].id,
      driver_id: driverId,
      driver_name: driverResult.rows[0]?.name || "Unknown Driver",
      vehicle_id: vehicleId,
      vehicle_number: vehicleNumber,
      timestamp: startTime,
    };

    // Emit the event to all connected clients
    io.emit("tripUpdate", tripEvent);
    console.log("Emitted trip start event:", tripEvent);

    res.status(201).json({
      message: "Trip started successfully",
      trip: {
        id: tripResult.rows[0].id,
        start_time: tripResult.rows[0].start_time,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Start trip error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// End an active trip - for mobile app
router.post("/end", authenticateDriverToken, async (req, res) => {
  try {
    const driverId = req.driverId;
    const { distance } = req.body; // Optional: distance traveled in kilometers

    // Find the active trip for this driver
    const activeTrip = await pool.query(
      `SELECT id, vehicle_id, start_time 
       FROM trips 
       WHERE driver_id = $1 AND status = 'active'`,
      [driverId]
    );

    if (activeTrip.rows.length === 0) {
      return res.status(404).json({ error: "No active trip found" });
    }

    const tripId = activeTrip.rows[0].id;
    const vehicleId = activeTrip.rows[0].vehicle_id;
    const startTime = new Date(activeTrip.rows[0].start_time);
    const endTime = new Date();

    // Calculate duration in minutes
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

    // Begin transaction
    await pool.query("BEGIN");

    // Update trip with end time and status
    await pool.query(
      `UPDATE trips 
       SET end_time = $1, 
           status = 'completed', 
           duration = $2,
           distance = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [endTime, durationMinutes, distance || null, tripId]
    );

    await pool.query("COMMIT");

    // Get vehicle and driver info for the socket event
    const vehicleResult = await pool.query(
      "SELECT vehicle_number FROM vehicles WHERE id = $1",
      [vehicleId]
    );

    const driverResult = await pool.query(
      "SELECT name FROM drivers WHERE id = $1",
      [driverId]
    );

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    const tripEvent = {
      type: "trip_ended",
      trip_id: tripId,
      driver_id: driverId,
      driver_name: driverResult.rows[0]?.name || "Unknown Driver",
      vehicle_id: vehicleId,
      vehicle_number:
        vehicleResult.rows[0]?.vehicle_number || "Unknown Vehicle",
      timestamp: endTime,
      duration_minutes: durationMinutes,
      distance: distance,
    };

    // Emit the event to all connected clients
    io.emit("tripUpdate", tripEvent);
    console.log("Emitted trip end event:", tripEvent);

    res.json({
      message: "Trip ended successfully",
      trip: {
        id: tripId,
        end_time: endTime,
        duration_minutes: durationMinutes,
        distance: distance,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("End trip error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin API: Start a trip for a driver - for web dashboard
router.post("/:driverId/start", authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;

    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id, name FROM drivers WHERE id = $1 AND user_id = $2",
      [driverId, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const driverName = driverCheck.rows[0].name;

    // Get the driver's currently assigned vehicle
    const vehicleResult = await pool.query(
      `SELECT v.id as vehicle_id, v.vehicle_number 
       FROM vehicles v 
       JOIN vehicle_driver_assignments vda ON v.id = vda.vehicle_id 
       WHERE vda.driver_id = $1 
       AND vda.id = (
         SELECT MAX(id) 
         FROM vehicle_driver_assignments 
         WHERE driver_id = $1
       )`,
      [driverId]
    );

    if (vehicleResult.rows.length === 0) {
      return res.status(400).json({ error: "No vehicle assigned to driver" });
    }

    const vehicleId = vehicleResult.rows[0].vehicle_id;
    const vehicleNumber = vehicleResult.rows[0].vehicle_number;

    // Check if driver already has an active trip
    const activeTrip = await pool.query(
      `SELECT id FROM trips 
       WHERE driver_id = $1 AND status = 'active'`,
      [driverId]
    );

    if (activeTrip.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Driver already has an active trip" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Create new trip
    const startTime = new Date();
    const tripResult = await pool.query(
      `INSERT INTO trips
        (driver_id, vehicle_id, start_time, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING id, start_time`,
      [driverId, vehicleId, startTime]
    );

    // Update vehicle's last_trip time
    await pool.query(
      "UPDATE vehicles SET last_trip = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [startTime, vehicleId]
    );

    await pool.query("COMMIT");

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    const tripEvent = {
      type: "trip_started",
      trip_id: tripResult.rows[0].id,
      driver_id: driverId,
      driver_name: driverName,
      vehicle_id: vehicleId,
      vehicle_number: vehicleNumber,
      timestamp: startTime,
    };

    // Emit the event to all connected clients
    io.emit("tripUpdate", tripEvent);
    console.log("Emitted trip start event:", tripEvent);

    res.status(201).json({
      message: "Trip started successfully",
      trip: {
        id: tripResult.rows[0].id,
        start_time: tripResult.rows[0].start_time,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Start trip error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin API: End a trip for a driver - for web dashboard
router.post("/:driverId/end", authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;
    const { distance } = req.body; // Optional: distance traveled in kilometers

    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id, name FROM drivers WHERE id = $1 AND user_id = $2",
      [driverId, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const driverName = driverCheck.rows[0].name;

    // Find the active trip for this driver
    const activeTrip = await pool.query(
      `SELECT id, vehicle_id, start_time 
       FROM trips 
       WHERE driver_id = $1 AND status = 'active'`,
      [driverId]
    );

    if (activeTrip.rows.length === 0) {
      return res.status(404).json({ error: "No active trip found" });
    }

    const tripId = activeTrip.rows[0].id;
    const vehicleId = activeTrip.rows[0].vehicle_id;
    const startTime = new Date(activeTrip.rows[0].start_time);
    const endTime = new Date();

    // Calculate duration in minutes
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

    // Begin transaction
    await pool.query("BEGIN");

    // Update trip with end time and status
    await pool.query(
      `UPDATE trips 
       SET end_time = $1, 
           status = 'completed', 
           duration = $2,
           distance = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [endTime, durationMinutes, distance || null, tripId]
    );

    await pool.query("COMMIT");

    // Get vehicle info for the socket event
    const vehicleResult = await pool.query(
      "SELECT vehicle_number FROM vehicles WHERE id = $1",
      [vehicleId]
    );

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    const tripEvent = {
      type: "trip_ended",
      trip_id: tripId,
      driver_id: driverId,
      driver_name: driverName,
      vehicle_id: vehicleId,
      vehicle_number:
        vehicleResult.rows[0]?.vehicle_number || "Unknown Vehicle",
      timestamp: endTime,
      duration_minutes: durationMinutes,
      distance: distance,
    };

    // Emit the event to all connected clients
    io.emit("tripUpdate", tripEvent);
    console.log("Emitted trip end event:", tripEvent);

    res.json({
      message: "Trip ended successfully",
      trip: {
        id: tripId,
        end_time: endTime,
        duration_minutes: durationMinutes,
        distance: distance,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("End trip error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all trips for a driver
router.get("/driver/:driverId", authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;

    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id FROM drivers WHERE id = $1 AND user_id = $2",
      [driverId, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Get all trips for this driver
    const tripsResult = await pool.query(
      `SELECT t.*, v.vehicle_number 
       FROM trips t
       JOIN vehicles v ON t.vehicle_id = v.id
       WHERE t.driver_id = $1
       ORDER BY t.start_time DESC`,
      [driverId]
    );

    res.json({ trips: tripsResult.rows });
  } catch (err) {
    console.error("Get driver trips error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all trips - Admin API
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Get all trips for this user's drivers
    const tripsResult = await pool.query(
      `SELECT t.*, d.name as driver_name, v.vehicle_number 
       FROM trips t
       JOIN drivers d ON t.driver_id = d.id
       JOIN vehicles v ON t.vehicle_id = v.id
       WHERE d.user_id = $1
       ORDER BY t.start_time DESC
       LIMIT 100`,
      [req.userId]
    );

    res.json({ trips: tripsResult.rows });
  } catch (err) {
    console.error("Get all trips error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get counts of total trips and active trips
router.get("/counts", authenticateToken, async (req, res) => {
  try {
    // Query for all trips and active trips counts
    const countsResult = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM trips t JOIN drivers d ON t.driver_id = d.id WHERE d.user_id = $1) as total_trips,
        (SELECT COUNT(*) FROM trips t JOIN drivers d ON t.driver_id = d.id WHERE d.user_id = $1 AND t.status = 'active') as active_trips,
        (SELECT COUNT(*) FROM trips t JOIN drivers d ON t.driver_id = d.id WHERE d.user_id = $1 AND t.end_time IS NOT NULL AND t.start_time >= NOW() - INTERVAL '24 hours') as trips_today
      `,
      [req.userId]
    );

    res.json({
      total_trips: parseInt(countsResult.rows[0].total_trips),
      active_trips: parseInt(countsResult.rows[0].active_trips),
      trips_today: parseInt(countsResult.rows[0].trips_today),
    });
  } catch (err) {
    console.error("Get trip counts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
