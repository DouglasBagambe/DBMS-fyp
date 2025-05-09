// server/server.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "*", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");

app.use("/api/auth", authRoutes);
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Authenticated dashboard access" });
});

app.get("/", (req, res) => {
  res.json({ message: "Driver Behavior Monitoring API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
