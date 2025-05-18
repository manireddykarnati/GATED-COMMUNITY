const express = require('express');
const router = express.Router();
const pool = require('../db');

// Login route
router.post('/login', async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users_login WHERE user_name = $1 AND password = $2',
      [user_name, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login successful', user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
