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

// Create jobs table if it doesn't exist
async function createJobsTable() {
  try {
    await pool.query(`
     CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY,

    product_name TEXT NOT NULL,

    description TEXT NOT NULL,

    reference_image TEXT,

    prompt TEXT NOT NULL,

      status VARCHAR(20) NOT NULL,

       image_url TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
    `);

    console.log("✅ Jobs table is ready");
  } catch (err) {
    console.error("❌ Failed to create jobs table");
    console.error(err);
  }
}

// Database Connection
pool.connect()
  .then(async (client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();

    // Create table after successful connection
    await createJobsTable();
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:");
    console.error(err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});