const { Pool } = require("./dbConfig");

async function testConnection() {
  try {
    console.log("Attempting to connect to the database...");
    const res = await pool.query("SELECT NOW()");
    console.log("Connection successful. Server time:", res.rows[0].now);

    console.log("Testing userss table query...");
    const userRes = await pool.query("SELECT id FROM userss LIMIT 1");
    console.log("Users found:", userRes.rows);
  } catch (err) {
    console.error("Connection test failed:", err);
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
}

testConnection();
