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

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, company, phone_number, gender, created_at FROM userss WHERE id = $1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  const { firstName, lastName, company, phoneNumber, gender } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !gender) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  if (!["male", "female", "rather_not_say"].includes(gender)) {
    return res.status(400).json({ error: "Invalid gender selection" });
  }

  try {
    const result = await pool.query(
      `UPDATE userss 
       SET first_name = $1, last_name = $2, company = $3, phone_number = $4, gender = $5
       WHERE id = $6
       RETURNING id, first_name, last_name, email, company, phone_number, gender, created_at`,
      [
        firstName,
        lastName,
        company || null,
        phoneNumber || null,
        gender,
        req.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0], message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user dashboard metrics
router.get("/metrics", authenticateToken, async (req, res) => {
  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Get vehicle count
    const vehiclesQuery =
      "SELECT COUNT(*) as vehicles FROM vehicles WHERE user_id = $1";
    const vehiclesResult = await pool.query(vehiclesQuery, [req.userId]);

    // Get active drivers count
    const driversQuery = `
      SELECT COUNT(DISTINCT d.id) as drivers
      FROM drivers d
      JOIN vehicle_driver_assignments vda ON d.id = vda.driver_id
      JOIN vehicles v ON vda.vehicle_id = v.id AND v.status = 'Active'
      WHERE d.user_id = $1
      AND vda.id IN (
        SELECT MAX(id) FROM vehicle_driver_assignments 
        GROUP BY driver_id
      )
    `;
    const driversResult = await pool.query(driversQuery, [req.userId]);

    // Get recent incidents count (last 7 days)
    const incidentsQuery = `
      SELECT COUNT(*) as incidents
      FROM incidents i
      JOIN drivers d ON i.driver_id = d.id
      WHERE d.user_id = $1
      AND i.incident_date >= NOW() - INTERVAL '7 days'
    `;
    const incidentsResult = await pool.query(incidentsQuery, [req.userId]);

    await pool.query("COMMIT");

    res.json({
      metrics: {
        vehicles: parseInt(vehiclesResult.rows[0].vehicles),
        activeDrivers: parseInt(driversResult.rows[0].drivers),
        recentIncidents: parseInt(incidentsResult.rows[0].incidents),
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Get metrics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
