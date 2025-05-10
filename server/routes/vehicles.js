// server/routes/vehicles.js

const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const router = express.Router();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Get all vehicles for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Get vehicles with driver information
    const vehiclesQuery = `
      SELECT v.id, v.vehicle_number, v.type, v.status, v.last_trip, 
             COALESCE(d.name, 'Unassigned') as driver, 
             COALESCE(d.driver_id, '') as driver_id
      FROM vehicles v
      LEFT JOIN vehicle_driver_assignments vda ON v.id = vda.vehicle_id AND vda.id = (
        SELECT MAX(id) FROM vehicle_driver_assignments WHERE vehicle_id = v.id
      )
      LEFT JOIN drivers d ON vda.driver_id = d.id
      WHERE v.user_id = $1
      ORDER BY v.created_at DESC
    `;

    const result = await pool.query(vehiclesQuery, [req.userId]);
    res.json({ vehicles: result.rows });
  } catch (err) {
    console.error("Get vehicles error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new vehicle
router.post("/", authenticateToken, async (req, res) => {
  const { vehicleNumber, type, status } = req.body;

  if (!vehicleNumber || !type || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if vehicle already exists
    const vehicleExists = await pool.query(
      "SELECT 1 FROM vehicles WHERE vehicle_number = $1",
      [vehicleNumber]
    );

    if (vehicleExists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Vehicle with this number already exists" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Insert vehicle
    const vehicleResult = await pool.query(
      `INSERT INTO vehicles 
        (vehicle_number, type, status, user_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, vehicle_number, type, status, last_trip`,
      [vehicleNumber, type, status, req.userId]
    );

    const vehicle = vehicleResult.rows[0];

    // Assign driver if provided
    if (req.body.driverId) {
      // Check if driver exists and belongs to user
      const driverResult = await pool.query(
        "SELECT id, name, driver_id FROM drivers WHERE id = $1 AND user_id = $2",
        [req.body.driverId, req.userId]
      );

      if (driverResult.rows.length > 0) {
        // Create assignment
        await pool.query(
          "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES ($1, $2)",
          [vehicle.id, req.body.driverId]
        );

        vehicle.driver = driverResult.rows[0].name;
        vehicle.driver_id = driverResult.rows[0].driver_id;
      }
    } else {
      vehicle.driver = "Unassigned";
      vehicle.driver_id = "";
    }

    await pool.query("COMMIT");
    res.status(201).json({ vehicle });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Add vehicle error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update vehicle
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { type, status, driverId } = req.body;

  if (!type || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Check if vehicle exists and belongs to user
    const vehicleCheck = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (vehicleCheck.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Update vehicle
    await pool.query(
      "UPDATE vehicles SET type = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [type, status, id]
    );

    // Handle driver assignment
    if (driverId) {
      // Check if driver exists and belongs to user
      const driverCheck = await pool.query(
        "SELECT id FROM drivers WHERE id = $1 AND user_id = $2",
        [driverId, req.userId]
      );

      if (driverCheck.rows.length > 0) {
        // Create new assignment
        await pool.query(
          "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES ($1, $2)",
          [id, driverId]
        );
      }
    } else {
      // Create unassigned entry
      await pool.query(
        "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES ($1, NULL)",
        [id]
      );
    }

    // Get updated vehicle with driver info
    const updatedVehicle = await pool.query(
      `
      SELECT v.id, v.vehicle_number, v.type, v.status, v.last_trip, 
             COALESCE(d.name, 'Unassigned') as driver,
             COALESCE(d.driver_id, '') as driver_id
      FROM vehicles v
      LEFT JOIN vehicle_driver_assignments vda ON v.id = vda.vehicle_id AND vda.id = (
        SELECT MAX(id) FROM vehicle_driver_assignments WHERE vehicle_id = v.id
      )
      LEFT JOIN drivers d ON vda.driver_id = d.id
      WHERE v.id = $1
    `,
      [id]
    );

    await pool.query("COMMIT");
    res.json({ vehicle: updatedVehicle.rows[0] });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Update vehicle error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete vehicle
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if vehicle exists and belongs to user
    const vehicleCheck = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Delete vehicle (cascade will take care of assignments)
    await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);

    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update vehicle's last trip
router.put("/:id/trip", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { timestamp } = req.body;

  if (!timestamp) {
    return res.status(400).json({ error: "Timestamp is required" });
  }

  try {
    // Check if vehicle exists and belongs to user
    const vehicleCheck = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Update last_trip
    await pool.query(
      "UPDATE vehicles SET last_trip = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [timestamp, id]
    );

    res.json({ message: "Trip recorded successfully" });
  } catch (err) {
    console.error("Update trip error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total vehicle count for metrics
router.get("/count", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as total FROM vehicles WHERE user_id = $1",
      [req.userId]
    );

    res.json({ count: parseInt(result.rows[0].total) });
  } catch (err) {
    console.error("Get vehicle count error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
