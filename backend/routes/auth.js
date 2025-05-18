// routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Register route
router.post("/register", async (req, res) => {
  console.log("Register request body:", req.body);

  const { user_type, user_name, email, password, org_id, plot_id } = req.body;

  // Validate required fields
  if (!user_name || !password || !user_type || !org_id || !plot_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists by user_name or email
    const existingUser = await pool.query(
      "SELECT * FROM users_login WHERE user_name = $1 OR email = $2",
      [user_name, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("User does not exist, proceeding to hash password...");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Password hashed, inserting user...");

    // Insert new user
    const insertQuery = `
      INSERT INTO users_login (user_type, user_name, email, password, org_id, plot_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      user_type,
      user_name,
      email,
      hashedPassword,
      org_id,
      plot_id,
    ]);

    console.log("User registered:", result.rows[0]);

    res.status(201).json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("Login request body:", req.body);

  const { user_name, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users_login WHERE user_name = $1", [user_name]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all organisations
router.get("/organisations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM organisation");
    res.json(result.rows);
  } catch (err) {
    console.error("Org fetch error:", err.message);
    res.status(500).json({ message: "Error fetching organisations" });
  }
});

// Get plots by organisation
router.get("/plots", async (req, res) => {
  const { org_id } = req.query;
  try {
    const result = await pool.query("SELECT * FROM plots WHERE org_id = $1", [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Plot fetch error:", err.message);
    res.status(500).json({ message: "Error fetching plots" });
  }
});

module.exports = router;
