// server/routes/driverAuth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const {
  verifyDriverPassword,
  setDriverPassword,
  createDriverSession,
} = require("../utils/driverAuth");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Helper function to get incident number based on incident type
const getIncidentNumber = (type) => {
  if (!type) return null;

  // Convert to lowercase for case-insensitive matching
  const lowerType = type.toLowerCase().trim();

  // Only accept these exact four types (case-insensitive)
  switch (lowerType) {
    case "phone":
      return 1;
    case "cigarette":
      return 2;
    case "seatbelt absence":
      return 3;
    case "sleepy":
      return 4;
    default:
      return null; // Return null for any other type
  }
};

// Driver login
router.post("/login", async (req, res) => {
  const { driverId, password } = req.body;

  try {
    // Get driver details
    const driverResult = await pool.query(
      "SELECT * FROM drivers WHERE driver_id = $1",
      [driverId]
    );

    if (driverResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid driver ID" });
    }

    const driver = driverResult.rows[0];
    let isValid = false;

    // Check if password has been changed
    if (driver.password_changed) {
      // Verify password
      isValid = await verifyDriverPassword(driverId, password);
    } else {
      // For initial login, password should match driver_id
      isValid = password === driverId;
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: driver.id,
        driverId: driver.driver_id,
        type: "driver",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create session
    await createDriverSession(driver.id, token);

    // Update last login
    await pool.query(
      "UPDATE drivers SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [driver.id]
    );

    res.json({
      token,
      driver: {
        id: driver.id,
        driverId: driver.driver_id,
        name: driver.name,
        passwordChanged: driver.password_changed,
      },
    });
  } catch (error) {
    console.error("Driver login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Set new password
router.post("/set-password", async (req, res) => {
  const { driverId, currentPassword, newPassword } = req.body;

  try {
    // Get driver details
    const driverResult = await pool.query(
      "SELECT * FROM drivers WHERE driver_id = $1",
      [driverId]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const driver = driverResult.rows[0];
    let isValid = false;

    // Verify current password
    if (driver.password_changed) {
      isValid = await verifyDriverPassword(driverId, currentPassword);
    } else {
      // For initial password change, current password should match driver_id
      isValid = currentPassword === driverId;
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Set new password
    await setDriverPassword(driverId, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Deactivate session
    await pool.query(
      "UPDATE driver_sessions SET is_active = FALSE WHERE token = $1",
      [token]
    );

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Log driver incident
router.post("/log-incident", authenticateToken, async (req, res) => {
  try {
    const { id: driverId } = req.user;
    const { type, severity, details } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Incident type is required" });
    }

    // Validate severity if provided
    let severityNum = null;
    if (severity !== undefined) {
      severityNum = parseInt(severity);
      if (isNaN(severityNum) || severityNum < 1 || severityNum > 5) {
        return res
          .status(400)
          .json({ error: "Severity must be a number between 1 and 5" });
      }
    }

    // Get the driver's currently assigned vehicle
    const vehicleResult = await pool.query(
      `SELECT v.id as vehicle_id 
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
      console.error(`No vehicle assigned to driver ${driverId}`);
      return res.status(400).json({ error: "No vehicle assigned to driver" });
    }

    const vehicleId = vehicleResult.rows[0].vehicle_id;

    // Get incident number based on incident type
    const incidentNo = getIncidentNumber(type);

    // Log the incident
    const result = await pool.query(
      `INSERT INTO incidents 
       (driver_id, vehicle_id, incident_type, description, severity, incident_date, incident_no) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6) 
       RETURNING *`,
      [driverId, vehicleId, type, details || null, severityNum, incidentNo]
    );

    // Update driver safety score only if severity is provided
    if (severityNum) {
      const scoreReduction = severityNum * 2;
      await pool.query(
        `UPDATE drivers 
         SET safety_score = GREATEST(0, safety_score - $1), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [scoreReduction, driverId]
      );
    }

    // Get driver and vehicle information for the socket event
    const driverInfo = await pool.query(
      "SELECT name FROM drivers WHERE id = $1",
      [driverId]
    );

    const vehicleInfo = await pool.query(
      "SELECT vehicle_number FROM vehicles WHERE id = $1",
      [vehicleId]
    );

    const driverName = driverInfo.rows[0]?.name || "Unknown Driver";
    const vehicleNumber =
      vehicleInfo.rows[0]?.vehicle_number || "Unknown Vehicle";

    // Get the Socket.io instance
    const io = req.app.get("io");

    // Create incident object for real-time notification
    const incidentAlert = {
      id: result.rows[0].id,
      driver_id: driverId,
      driver_name: driverName,
      vehicle_id: vehicleId,
      vehicle_number: vehicleNumber,
      incident_type: type,
      incident_no: incidentNo,
      timestamp: result.rows[0].created_at || result.rows[0].incident_date,
      severity: severityNum || 1,
      description: details || "",
      type: "safety_incident",
      message: `Driver ${driverName} had a ${type} incident in vehicle ${vehicleNumber}`,
    };

    // Emit the incident alert to all connected clients
    io.emit("newIncident", incidentAlert);
    console.log("Emitted new incident alert:", incidentAlert);

    console.log("Incident logged successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error logging incident:", error);
    res.status(500).json({
      error: "Failed to log incident",
      details: error.message,
    });
  }
});

// Get driver incidents
router.get("/incidents", authenticateToken, async (req, res) => {
  try {
    const { id: driverId } = req.user;

    const result = await pool.query(
      `SELECT i.*, v.vehicle_number 
       FROM incidents i
       LEFT JOIN vehicles v ON i.vehicle_id = v.id
       WHERE i.driver_id = $1 
       ORDER BY i.incident_date DESC 
       LIMIT 50`,
      [driverId]
    );

    console.log(`Found ${result.rows.length} incidents for driver ${driverId}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({
      error: "Failed to fetch incidents",
      details: error.message,
    });
  }
});

module.exports = router;
