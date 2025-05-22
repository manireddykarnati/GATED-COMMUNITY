const express = require('express');
const router = express.Router();
const pool = require('../db'); // your PostgreSQL pool connection
const bcrypt = require('bcrypt');

// Register route
router.post('/register', async (req, res) => {
  console.log('Register request body:', req.body);

  const { user_type, user_name, email, password, org_id, plot_id } = req.body;

  try {
    // Check if username or email already exists
    const userCheck = await pool.query(
      'SELECT * FROM users_login WHERE user_name = $1 OR email = $2',
      [user_name, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users_login (user_type, user_name, email, password, org_id, plot_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_type, user_name, email, hashedPassword, org_id, plot_id]
    );

    res.status(201).json({ success: true, message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { user_name, password } = req.body;
  console.log("Login attempt with username:", user_name);

  try {
    const result = await pool.query(
      'SELECT * FROM users_login WHERE user_name = $1',
      [user_name]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Send success flag in response
    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;