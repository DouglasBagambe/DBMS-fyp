// server/routes/drivers.js

const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const router = express.Router();

// Helper function to normalize incident types to standard categories
const normalizeIncidentType = (type) => {
  if (!type) return "OTHER";

  const upperType = type.toUpperCase();

  // Phone usage detection
  if (upperType.includes("PHONE") || upperType.includes("Phone"))
    return "PHONE_USAGE";

  // Drowsiness detection
  if (upperType.includes("Sleepy") || upperType.includes("SLEEPY"))
    return "DROWSINESS";

  // Cigarette usage detection
  if (upperType.includes("CIGARETTE") || upperType.includes("Cigarette"))
    return "CIGARETTE";

  // Seatbelt detection
  if (
    upperType.includes("SEATBELT ABSENCE") ||
    upperType.includes("Seatbelt Absence")
  )
    return "SEATBELT";

  // Default to OTHER if no match
  return "OTHER";
};

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

// Get all drivers for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const driversQuery = `
      SELECT d.id, d.driver_id, d.name, d.safety_score,
             COALESCE(v.vehicle_number, 'None') as vehicle,
             (SELECT COUNT(*) FROM incidents WHERE driver_id = d.id) as incidents
      FROM drivers d
      LEFT JOIN vehicle_driver_assignments vda ON d.id = vda.driver_id AND vda.id = (
        SELECT MAX(id) FROM vehicle_driver_assignments WHERE driver_id = d.id
      )
      LEFT JOIN vehicles v ON vda.vehicle_id = v.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `;

    const result = await pool.query(driversQuery, [req.userId]);
    res.json({ drivers: result.rows });
  } catch (err) {
    console.error("Get drivers error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new driver
router.post("/", authenticateToken, async (req, res) => {
  const { name, driverId, vehicleId } = req.body;

  if (!name || !driverId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if driver ID already exists
    const driverExists = await pool.query(
      "SELECT 1 FROM drivers WHERE driver_id = $1",
      [driverId]
    );

    if (driverExists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Driver with this ID already exists" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Insert driver
    const driverResult = await pool.query(
      `INSERT INTO drivers 
        (driver_id, name, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, driver_id, name`,
      [driverId, name, req.userId]
    );

    const driver = driverResult.rows[0];
    driver.incidents = 0;

    // Assign vehicle if provided
    if (vehicleId && vehicleId !== "None") {
      // Check if vehicle exists and belongs to user
      const vehicleResult = await pool.query(
        "SELECT id, vehicle_number FROM vehicles WHERE id = $1 AND user_id = $2",
        [vehicleId, req.userId]
      );

      if (vehicleResult.rows.length > 0) {
        // Create assignment
        await pool.query(
          "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES ($1, $2)",
          [vehicleId, driver.id]
        );

        driver.vehicle = vehicleResult.rows[0].vehicle_number;
      } else {
        driver.vehicle = "None";
      }
    } else {
      driver.vehicle = "None";
    }

    await pool.query("COMMIT");
    res.status(201).json({ driver });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Add driver error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update driver
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, vehicleId } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Driver name is required" });
  }

  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id FROM drivers WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update driver
    await pool.query(
      "UPDATE drivers SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [name, id]
    );

    // Handle vehicle assignment
    if (vehicleId && vehicleId !== "None") {
      // Check if vehicle exists and belongs to user
      const vehicleCheck = await pool.query(
        "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
        [vehicleId, req.userId]
      );

      if (vehicleCheck.rows.length > 0) {
        // Create new assignment
        await pool.query(
          "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES ($1, $2)",
          [vehicleId, id]
        );
      }
    } else {
      // Create unassigned entry
      await pool.query(
        "INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id) VALUES (NULL, $1)",
        [id]
      );
    }

    // Get updated driver with vehicle info
    const updatedDriver = await pool.query(
      `
      SELECT d.id, d.driver_id, d.name, d.safety_score,
             COALESCE(v.vehicle_number, 'None') as vehicle,
             (SELECT COUNT(*) FROM incidents WHERE driver_id = d.id) as incidents
      FROM drivers d
      LEFT JOIN vehicle_driver_assignments vda ON d.id = vda.driver_id AND vda.id = (
        SELECT MAX(id) FROM vehicle_driver_assignments WHERE driver_id = d.id
      )
      LEFT JOIN vehicles v ON vda.vehicle_id = v.id
      WHERE d.id = $1
    `,
      [id]
    );

    await pool.query("COMMIT");
    res.json({ driver: updatedDriver.rows[0] });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Update driver error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete driver
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id FROM drivers WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Delete driver (cascade will take care of assignments and incidents)
    await pool.query("DELETE FROM drivers WHERE id = $1", [id]);

    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    console.error("Delete driver error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Record safety incident
router.post("/:id/incidents", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { vehicleId, incidentType, description, severity } = req.body;

  if (!incidentType) {
    return res.status(400).json({ error: "Incident type is required" });
  }

  // Validate severity if provided
  let severityNum = null;
  if (severity !== undefined) {
    severityNum = parseInt(severity);
    if (isNaN(severityNum) || severityNum < 1 || severityNum > 5) {
      return res
        .status(400)
        .json({ error: "Severity must be between 1 and 5" });
    }
  }

  try {
    // Check if driver exists and belongs to user
    const driverCheck = await pool.query(
      "SELECT id FROM drivers WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Check if vehicle exists and belongs to user
    const vehicleCheck = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
      [vehicleId, req.userId]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Record incident
    await pool.query(
      `INSERT INTO incidents 
        (driver_id, vehicle_id, incident_type, description, severity, incident_date) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [id, vehicleId, incidentType, description || null, severityNum]
    );

    // Update driver safety score only if severity is provided
    if (severityNum) {
      const scoreReduction = severityNum * 2; // Example: severity 1 = -2 points, severity 5 = -10 points
      await pool.query(
        `UPDATE drivers 
         SET safety_score = GREATEST(0, safety_score - $1), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [scoreReduction, id]
      );
    }

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Incident recorded successfully",
      scoreReduction: severityNum ? severityNum * 2 : 0,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Record incident error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get active driver count for metrics
router.get("/count/active", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT COUNT(DISTINCT d.id) as active
      FROM drivers d
      JOIN vehicle_driver_assignments vda ON d.id = vda.driver_id
      JOIN vehicles v ON vda.vehicle_id = v.id AND v.status = 'Active'
      WHERE d.user_id = $1
      AND vda.id IN (
        SELECT MAX(id) FROM vehicle_driver_assignments 
        GROUP BY driver_id
      )
    `,
      [req.userId]
    );

    res.json({ count: parseInt(result.rows[0].active) });
  } catch (err) {
    console.error("Get active drivers count error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get incident count for metrics
router.get("/incidents/count", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM incidents i
      JOIN drivers d ON i.driver_id = d.id
      WHERE d.user_id = $1
      AND i.incident_date >= NOW() - INTERVAL '7 days'
    `,
      [req.userId]
    );

    res.json({ count: parseInt(result.rows[0].total) });
  } catch (err) {
    console.error("Get incidents count error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get driver details by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get driver details with vehicle and incident information
    const driverQuery = `
      SELECT 
        d.id,
        d.driver_id,
        d.name,
        d.phone_number,
        d.safety_score,
        d.created_at,
        d.last_login,
        COALESCE(v.vehicle_number, 'None') as vehicle,
        v.id as vehicle_id,
        (SELECT COUNT(*) FROM incidents WHERE driver_id = d.id) as incidents,
        (SELECT COUNT(*) FROM trips WHERE driver_id = d.id) as total_trips
      FROM drivers d
      LEFT JOIN vehicle_driver_assignments vda ON d.id = vda.driver_id AND vda.id = (
        SELECT MAX(id) FROM vehicle_driver_assignments WHERE driver_id = d.id
      )
      LEFT JOIN vehicles v ON vda.vehicle_id = v.id
      WHERE d.id = $1 AND d.user_id = $2
    `;

    const result = await pool.query(driverQuery, [id, req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Get recent activity (last 15 incidents)
    const activityQuery = `
      SELECT 
        i.id,
        i.incident_type,
        i.description,
        i.severity,
        i.incident_date,
        i.created_at,
        v.vehicle_number
      FROM incidents i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      WHERE i.driver_id = $1
      ORDER BY i.incident_date DESC NULLS LAST, i.created_at DESC
      LIMIT 15
    `;

    const activityResult = await pool.query(activityQuery, [id]);

    // Get the most common incident type
    const incidentTypeQuery = `
      SELECT incident_type, COUNT(*) as count
      FROM incidents
      WHERE driver_id = $1
      GROUP BY incident_type
      ORDER BY count DESC
      LIMIT 1
    `;

    const incidentTypeResult = await pool.query(incidentTypeQuery, [id]);

    const driver = result.rows[0];

    // Normalize all incident types in the activity results
    const incidents_list = activityResult.rows.map((incident) => ({
      ...incident,
      // Add a normalized version of the incident type
      normalized_type: normalizeIncidentType(incident.incident_type),
    }));

    // Set the driver's primary incident type if available
    if (incidentTypeResult.rows.length > 0) {
      driver.incident_type = normalizeIncidentType(
        incidentTypeResult.rows[0].incident_type
      );
    }

    // Add both raw and normalized incident data
    driver.recent_activity = activityResult.rows;
    driver.incidents_list = incidents_list;

    res.json({ driver });
  } catch (err) {
    console.error("Get driver details error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
