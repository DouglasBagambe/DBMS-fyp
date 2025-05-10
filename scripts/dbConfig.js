const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://dbms_owner:npg_s8epy1ZvGoWV@ep-weathered-wave-abiu2urr-pooler.eu-west-2.aws.neon.tech/dbms?sslmode=require",
  ssl: {
    rejectUnauthorized: false, // Required for Neon to handle SSL
  },
});

module.exports = pool;
