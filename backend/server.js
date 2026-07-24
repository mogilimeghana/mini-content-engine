const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT;

// Routes
const healthRoutes = require("./routes/healthRoutes");
const generateRoutes = require("./routes/generateRoutes");

app.use("/", healthRoutes);
app.use("/", generateRoutes);

// Database Connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
.catch(err => {
  console.error("❌ Database Connection Failed:");
  console.error(err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});