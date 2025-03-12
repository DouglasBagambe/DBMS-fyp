// server/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import middleware
const auth = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");

// Use routes
app.use("/api/auth", authRoutes);

// Protect dashboard route
app.get("/api/dashboard", auth, (req, res) => {
  res.json({ message: "Welcome to the dashboard, you are authenticated!" });
});

// Test route
app.get("/", (req, res) => {
  res.send("Driver Behavior Monitoring API");
});

// Define port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
