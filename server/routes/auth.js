// server/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const router = express.Router();

// Input validation for signup
const validateInput = (firstName, lastName, email, password, gender) => {
  if (!firstName || !lastName || !email || !password || !gender)
    return "Required fields are missing";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!["male", "female", "rather_not_say"].includes(gender))
    return "Invalid gender selection";
  return null;
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

// Signup route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, company, phoneNumber, gender } =
    req.body;

  const validationError = validateInput(
    firstName,
    lastName,
    email,
    password,
    gender
  );
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const userExists = await pool.query(
      "SELECT 1 FROM userss WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO userss (first_name, last_name, email, password, company, phone_number, gender) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, first_name, last_name, email, company, phone_number, gender, created_at`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        company || null,
        phoneNumber || null,
        gender,
      ]
    );

    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM userss WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
    await pool.query("BEGIN");

    const vehiclesQuery =
      "SELECT COUNT(*) as vehicles FROM vehicles WHERE user_id = $1";
    const vehiclesResult = await pool.query(vehiclesQuery, [req.userId]);

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
