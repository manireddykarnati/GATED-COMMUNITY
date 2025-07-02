const express = require('express');
const router = express.Router();
const pool = require('../db');

// ========== STREETS CRUD ==========

// Get all streets for an organization
router.get('/streets/:org_id', async (req, res) => {
  try {
    const { org_id } = req.params;
    const result = await pool.query('SELECT * FROM streets WHERE org_id = $1', [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching streets:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch streets' });
  }
});

// Add a new street
router.post('/streets', async (req, res) => {
  const { org_id, street_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO streets (org_id, street_name) VALUES ($1, $2) RETURNING *',
      [org_id, street_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding street:', err);
    res.status(500).json({ success: false, message: 'Failed to add street' });
  }
});

// Update a street
router.put('/streets/:id', async (req, res) => {
  const { id } = req.params;
  const { street_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE streets SET street_name = $1 WHERE street_id = $2 RETURNING *',
      [street_name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating street:', err);
    res.status(500).json({ success: false, message: 'Failed to update street' });
  }
});

// Delete a street
router.delete('/streets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM streets WHERE street_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting street:', err);
    res.status(500).json({ success: false, message: 'Failed to delete street' });
  }
});

// ========== PLOTS CRUD ==========

// Get all plots for an organization
router.get('/plots/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, s.street_name 
       FROM plots p
       LEFT JOIN streets s ON p.street_id = s.street_id
       WHERE p.org_id = $1`,
      [org_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plots:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch plots' });
  }
});

// Add a new plot
router.post('/plots', async (req, res) => {
  const { org_id, street_id, plot_type, plot_no } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO plots (org_id, street_id, plot_type, plot_no)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [org_id, street_id, plot_type, plot_no]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding plot:', err);
    res.status(500).json({ success: false, message: 'Failed to add plot' });
  }
});

// Update a plot
router.put('/plots/:id', async (req, res) => {
  const { id } = req.params;
  const { street_id, plot_type, plot_no } = req.body;
  try {
    const result = await pool.query(
      `UPDATE plots SET street_id = $1, plot_type = $2, plot_no = $3
       WHERE plot_id = $4 RETURNING *`,
      [street_id, plot_type, plot_no, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating plot:', err);
    res.status(500).json({ success: false, message: 'Failed to update plot' });
  }
});

// Delete a plot
router.delete('/plots/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM plots WHERE plot_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting plot:', err);
    res.status(500).json({ success: false, message: 'Failed to delete plot' });
  }
});

// ========== FLATS CRUD ==========

// Get all flats for a plot
router.get('/flats/:plot_id', async (req, res) => {
  const { plot_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM flats WHERE plot_id = $1',
      [plot_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching flats:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch flats' });
  }
});

// Add flat
router.post('/flats', async (req, res) => {
  const { plot_id, flat_no, eb_card } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO flats (plot_id, flat_no, eb_card)
       VALUES ($1, $2, $3) RETURNING *`,
      [plot_id, flat_no, eb_card]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding flat:', err);
    res.status(500).json({ success: false, message: 'Failed to add flat' });
  }
});

// Update flat
router.put('/flats/:id', async (req, res) => {
  const { id } = req.params;
  const { flat_no, eb_card } = req.body;
  try {
    const result = await pool.query(
      `UPDATE flats SET flat_no = $1, eb_card = $2
       WHERE flat_id = $3 RETURNING *`,
      [flat_no, eb_card, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating flat:', err);
    res.status(500).json({ success: false, message: 'Failed to update flat' });
  }
});

// Delete flat
router.delete('/flats/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM flats WHERE flat_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting flat:', err);
    res.status(500).json({ success: false, message: 'Failed to delete flat' });
  }
});

// ========== RESIDENTS CRUD (UPDATED WITH LOGIN MANAGEMENT) ==========

// Get all residents for an org with login status
router.get('/residents/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        r.*, 
        p.plot_no, 
        f.flat_no,
        ul.user_name,
        ul.user_type,
        CASE WHEN ul.user_id IS NOT NULL THEN true ELSE false END as has_login
       FROM residents r
       LEFT JOIN plots p ON r.plot_id = p.plot_id
       LEFT JOIN flats f ON r.flat_id = f.flat_id
       LEFT JOIN users_login ul ON r.resident_id = ul.resident_id
       WHERE p.org_id = $1
       ORDER BY r.name`,
      [org_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch residents error:', err);
    res.status(500).json({ message: 'Failed to fetch residents' });
  }
});

// Add resident with optional login creation
router.post('/residents', async (req, res) => {
  const {
    plot_id, flat_id, name, contact_number, email, id_proof,
    create_login, user_name, password, user_type
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert resident
    const residentResult = await client.query(
      `INSERT INTO residents (plot_id, flat_id, name, contact_number, email, id_proof)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [plot_id, flat_id || null, name, contact_number, email, id_proof]
    );

    const resident = residentResult.rows[0];

    // Create login if requested
    if (create_login && user_name && password) {
      // Check if username already exists
      const userCheck = await client.query(
        'SELECT user_id FROM users_login WHERE user_name = $1',
        [user_name]
      );

      if (userCheck.rows.length > 0) {
        throw new Error('Username already exists');
      }

      // Get org_id from plot
      const plotResult = await client.query(
        'SELECT org_id FROM plots WHERE plot_id = $1',
        [plot_id]
      );

      const org_id = plotResult.rows[0].org_id;

      await client.query(
        `INSERT INTO users_login (user_name, password, org_id, plot_id, resident_id, user_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user_name, password, org_id, plot_id, resident.resident_id, user_type || 'owner']
      );
    }

    await client.query('COMMIT');
    res.status(201).json(resident);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Add resident error:', err);
    res.status(500).json({ message: err.message || 'Failed to add resident' });
  } finally {
    client.release();
  }
});

// Update resident with optional login creation
router.put('/residents/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, contact_number, email, id_proof,
    create_login, user_name, password, user_type
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update resident basic info
    const residentResult = await client.query(
      `UPDATE residents
       SET name = $1, contact_number = $2, email = $3, id_proof = $4
       WHERE resident_id = $5 RETURNING *`,
      [name, contact_number, email, id_proof, id]
    );

    const resident = residentResult.rows[0];

    // Create login if requested and doesn't exist
    if (create_login && user_name && password) {
      // Check if resident already has login
      const existingLogin = await client.query(
        'SELECT user_id FROM users_login WHERE resident_id = $1',
        [id]
      );

      if (existingLogin.rows.length === 0) {
        // Check if username is available
        const userCheck = await client.query(
          'SELECT user_id FROM users_login WHERE user_name = $1',
          [user_name]
        );

        if (userCheck.rows.length > 0) {
          throw new Error('Username already exists');
        }

        // Get org_id from resident's plot
        const plotResult = await client.query(
          'SELECT org_id FROM plots WHERE plot_id = $1',
          [resident.plot_id]
        );

        const org_id = plotResult.rows[0].org_id;

        await client.query(
          `INSERT INTO users_login (user_name, password, org_id, plot_id, resident_id, user_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user_name, password, org_id, resident.plot_id, id, user_type || 'owner']
        );
      }
    }

    await client.query('COMMIT');
    res.json(resident);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update resident error:', err);
    res.status(500).json({ message: err.message || 'Failed to update resident' });
  } finally {
    client.release();
  }
});

// Reset resident password
router.put('/residents/:id/reset-password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users_login 
       SET password = $1, last_login = NULL
       WHERE resident_id = $2 RETURNING user_name`,
      [password, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No login account found for this resident' });
    }

    res.json({
      success: true,
      message: 'Password updated successfully',
      user_name: result.rows[0].user_name
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Delete resident (and associated login)
router.delete('/residents/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete associated login first
    await client.query('DELETE FROM users_login WHERE resident_id = $1', [id]);

    // Delete resident
    await client.query('DELETE FROM residents WHERE resident_id = $1', [id]);

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete resident error:', err);
    res.status(500).json({ message: 'Failed to delete resident' });
  } finally {
    client.release();
  }
});

// ========== PAYMENTS CRUD ==========

// Get all payments by org
router.get('/payments/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT pay.*, r.name as resident_name, p.plot_no, f.flat_no
      FROM payments pay
      LEFT JOIN residents r ON pay.resident_id = r.resident_id
      LEFT JOIN plots p ON pay.plot_id = p.plot_id
      LEFT JOIN flats f ON r.flat_id = f.flat_id
      WHERE p.org_id = $1
      ORDER BY pay.payment_date DESC
    `, [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// Add a payment
router.post('/payments', async (req, res) => {
  const {
    plot_id, resident_id, amount, payment_type, payment_date,
    due_date, status, payment_method, transaction_id, notes
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO payments (
        plot_id, resident_id, amount, payment_type,
        payment_date, due_date, status, payment_method,
        transaction_id, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [plot_id, resident_id, amount, payment_type, payment_date, due_date, status, payment_method, transaction_id, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding payment:', err);
    res.status(500).json({ message: 'Failed to add payment' });
  }
});

// Delete payment
router.delete('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payments WHERE payment_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
});

// ========== REPORTS ==========

router.get('/reports/payment-summary/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) AS count, SUM(amount) AS total
      FROM payments pay
      JOIN plots p ON pay.plot_id = p.plot_id
      WHERE p.org_id = $1
      GROUP BY status
    `, [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching payment summary:', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

router.get('/reports/resident-count/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.street_name, COUNT(r.resident_id) AS resident_count
      FROM residents r
      JOIN plots p ON r.plot_id = p.plot_id
      JOIN streets s ON p.street_id = s.street_id
      WHERE p.org_id = $1
      GROUP BY s.street_name
    `, [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching resident count:', err);
    res.status(500).json({ message: 'Failed to fetch resident count' });
  }
});

router.get('/reports/overdue-payments/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT pay.*, r.name AS resident_name, p.plot_no, f.flat_no
      FROM payments pay
      JOIN residents r ON pay.resident_id = r.resident_id
      JOIN plots p ON pay.plot_id = p.plot_id
      LEFT JOIN flats f ON r.flat_id = f.flat_id
      WHERE p.org_id = $1 AND pay.status = 'overdue'
      ORDER BY pay.due_date ASC
    `, [org_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching overdue payments:', err);
    res.status(500).json({ message: 'Failed to fetch overdue payments' });
  }
});

// ========== SEND NOTIFICATIONS ==========
router.post('/notifications', async (req, res) => {
  const { sender_id, recipient_type, recipient_id, title, message, priority } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO notifications (
        sender_id, recipient_type, recipient_id,
        title, message, priority
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [sender_id, recipient_type, recipient_id, title, message, priority || 'normal']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});
// ========== MAINTENANCE REQUESTS ==========

// Raise new maintenance request
router.post('/maintenance', async (req, res) => {
  const { plot_id, resident_id, title, description, category, priority } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO maintenance_requests 
        (plot_id, resident_id, title, description, category, priority, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending', NOW())
       RETURNING *`,
      [plot_id, resident_id, title, description, category, priority]
    );
    res.status(201).json({ success: true, request: result.rows[0] });
  } catch (err) {
    console.error("Error submitting maintenance request:", err);
    res.status(500).json({ success: false, message: "Failed to submit request" });
  }
});


module.exports = router;