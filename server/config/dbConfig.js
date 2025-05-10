// server/config/dbConfig.js

const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Successfully connected to the database");
    release();
  }
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client:", err.message);
  process.exit(-1);
});

module.exports = pool;
