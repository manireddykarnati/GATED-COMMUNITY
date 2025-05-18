// server.js
require("dotenv").config();  // Load .env variables at the very start
const express = require("express");
const cors = require("cors");

const app = express();

console.log("Starting server...");

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // Use /api prefix for all auth routes

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
