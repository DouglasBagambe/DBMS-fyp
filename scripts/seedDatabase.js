/**
 * This script helps seed the database with sample data for testing.
 * Run it after signing up a user to add vehicles and drivers to their account.
 */

const pool = require("../server/config/dbConfig");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seedDatabase() {
  // Get the command line arguments
  const args = process.argv.slice(2);
  let userId;

  if (args.length > 0) {
    userId = parseInt(args[0]);
    console.log(`Using provided user ID: ${userId}`);
  } else {
    // Use the first user in the database if no user ID is provided
    try {
      const userResult = await pool.query("SELECT id FROM userss LIMIT 1");
      if (userResult.rows.length === 0) {
        console.error(
          "No users found in the database. Please sign up a user first."
        );
        process.exit(1);
      }
      userId = userResult.rows[0].id;
      console.log(`Using first user ID from database: ${userId}`);
    } catch (err) {
      console.error("Error finding a user:", err);
      process.exit(1);
    }
  }

  // Begin transaction
  try {
    await pool.query("BEGIN");

    // Create sample vehicles with Ugandan number plates
    const vehicles = [
      { number: "UAX 123A", type: "Truck", status: "Active" },
      { number: "UBA 456B", type: "Van", status: "Active" },
      { number: "UAR 789C", type: "Car", status: "Maintenance" },
      { number: "UAY 234D", type: "Truck", status: "Inactive" },
      { number: "UBB 567E", type: "Van", status: "Active" },
    ];

    console.log("Adding sample vehicles...");
    const vehicleIds = [];
    for (const vehicle of vehicles) {
      const result = await pool.query(
        `INSERT INTO vehicles (vehicle_number, type, status, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [vehicle.number, vehicle.type, vehicle.status, userId]
      );
      vehicleIds.push(result.rows[0].id);
    }

    // Create sample drivers with Ugandan names
    const drivers = [
      { id: "DRV001", name: "Joseph Kizza" },
      { id: "DRV002", name: "Sarah Nakato" },
      { id: "DRV003", name: "David Mugisha" },
      { id: "DRV004", name: "Esther Namuddu" },
    ];

    console.log("Adding sample drivers...");
    const driverIds = [];
    for (const driver of drivers) {
      const result = await pool.query(
        `INSERT INTO drivers (driver_id, name, user_id, safety_score)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [driver.id, driver.name, userId, Math.floor(Math.random() * 20) + 80] // Random safety score between 80-100
      );
      driverIds.push(result.rows[0].id);
    }

    // Create vehicle-driver assignments
    console.log("Creating vehicle-driver assignments...");
    await pool.query(
      `INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id)
       VALUES ($1, $2)`,
      [vehicleIds[0], driverIds[0]]
    );

    await pool.query(
      `INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id)
       VALUES ($1, $2)`,
      [vehicleIds[1], driverIds[1]]
    );

    await pool.query(
      `INSERT INTO vehicle_driver_assignments (vehicle_id, driver_id)
       VALUES ($1, $2)`,
      [vehicleIds[4], driverIds[2]]
    );

    // Create sample incidents
    console.log("Adding sample incidents...");
    const incidents = [
      {
        driver_id: driverIds[0],
        vehicle_id: vehicleIds[0],
        type: "Speeding",
        description: "Exceeded speed limit by 15mph",
        severity: 3,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        driver_id: driverIds[1],
        vehicle_id: vehicleIds[1],
        type: "Late Delivery",
        description: "Delivery delayed by 3 hours",
        severity: 1,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        driver_id: driverIds[2],
        vehicle_id: vehicleIds[4],
        type: "Harsh Braking",
        description: "Sudden braking detected on Kampala-Jinja highway",
        severity: 2,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        driver_id: driverIds[0],
        vehicle_id: vehicleIds[0],
        type: "Lane Violation",
        description: "Improper lane change without signaling",
        severity: 2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    for (const incident of incidents) {
      await pool.query(
        `INSERT INTO incidents (driver_id, vehicle_id, incident_type, description, severity, incident_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          incident.driver_id,
          incident.vehicle_id,
          incident.type,
          incident.description,
          incident.severity,
          incident.date,
        ]
      );
    }

    // Commit transaction
    await pool.query("COMMIT");
    console.log("Database seeded successfully!");
  } catch (err) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error seeding database:", err);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    console.log("Database connection closed.");
  }
}

// Run the seeding function
seedDatabase();
