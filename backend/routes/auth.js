const express = require('express');
const router = express.Router();
const pool = require('../db'); // your PostgreSQL pool connection

// Register route
router.post('/register', async (req, res) => {
  console.log('Register request body:', req.body);
  
  const { user_type, user_name, password, org_id, plot_id } = req.body;
  
  try {
    // Check if username already exists
    const userCheck = await pool.query(
      'SELECT * FROM users_login WHERE user_name = $1',
      [user_name]
    );
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Insert new user (without password hashing)
    const newUser = await pool.query(
      `INSERT INTO users_login (user_type, user_name, password, org_id, plot_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_type, user_name, password, org_id, plot_id]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: newUser.rows[0] 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
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
    
    // Direct password comparison (no hashing)
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    
    let displayName = user.user_name;
    let welcomeMessage = '';
    
    // If user is admin, show admin welcome
    if (user.user_type === 'admin') {
      welcomeMessage = 'Welcome Admin';
      displayName = 'Admin';
    } else {
      // For regular users, fetch their actual name from residents table
      try {
        const residentResult = await pool.query(
          'SELECT name FROM residents WHERE plot_id = $1',
          [user.plot_id]
        );
        
        if (residentResult.rows.length > 0) {
          displayName = residentResult.rows[0].name;
          welcomeMessage = `Welcome ${displayName}`;
        } else {
          welcomeMessage = `Welcome ${user.user_name}`;
        }
      } catch (err) {
        console.log('Could not fetch resident name:', err.message);
        welcomeMessage = `Welcome ${user.user_name}`;
      }
    }
    
    // Send success response with user details
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      welcomeMessage: welcomeMessage,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_type: user.user_type,
        org_id: user.org_id,
        plot_id: user.plot_id,
        display_name: displayName
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;