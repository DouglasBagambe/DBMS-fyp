const bcrypt = require("bcryptjs");
const pool = require("../config/dbConfig");

// Set driver password
const setDriverPassword = async (driverId, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `UPDATE drivers 
       SET password_hash = $1, 
           password_changed = true 
       WHERE driver_id = $2`,
      [hashedPassword, driverId]
    );
  } catch (error) {
    console.error("Error setting password:", error);
    throw new Error("Failed to set password");
  }
};

// Verify driver password
const verifyDriverPassword = async (driverId, password) => {
  try {
    const result = await pool.query(
      "SELECT password_hash FROM drivers WHERE driver_id = $1",
      [driverId]
    );

    if (result.rows.length === 0) {
      return false;
    }

    return await bcrypt.compare(password, result.rows[0].password_hash);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
};

// Create driver session
const createDriverSession = async (driverId, token, deviceInfo) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1); // Token valid for 1 day

  try {
    await pool.query(
      `INSERT INTO driver_sessions 
       (driver_id, token, expires_at, device_info) 
       VALUES ($1, $2, $3, $4)`,
      [driverId, token, expiresAt, deviceInfo]
    );
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
};

module.exports = {
  setDriverPassword,
  verifyDriverPassword,
  createDriverSession,
};
