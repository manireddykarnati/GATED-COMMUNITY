const express = require('express');
const router = express.Router();
const pool = require('../db');  // Your PostgreSQL pool connection
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const { user_type, user_name, email, password, org_id, plot_id } = req.body;

    // Check if user already exists by username or email (optional)
    const existingUser = await pool.query(
      'SELECT * FROM users_login WHERE user_name = $1 OR email = $2',
      [user_name, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with that username or email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with all fields
    const newUser = await pool.query(
      `INSERT INTO users_login 
       (user_type, user_name, email, password, org_id, plot_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_type, user_name, email, hashedPassword, org_id, plot_id]
    );

    res.status(201).json({
      message: 'Registration successful',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

module.exports = router;
