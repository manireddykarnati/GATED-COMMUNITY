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

// ========== RESIDENTS CRUD ==========

// Get all residents for an org
router.get('/residents/:org_id', async (req, res) => {
  const { org_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, p.plot_no, f.flat_no 
       FROM residents r
       LEFT JOIN plots p ON r.plot_id = p.plot_id
       LEFT JOIN flats f ON r.flat_id = f.flat_id
       WHERE p.org_id = $1`,
      [org_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch residents error:', err);
    res.status(500).json({ message: 'Failed to fetch residents' });
  }
});

// Add resident
router.post('/residents', async (req, res) => {
  const { plot_id, flat_id, name, contact_number, email, id_proof } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO residents (plot_id, flat_id, name, contact_number, email, id_proof)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [plot_id, flat_id || null, name, contact_number, email, id_proof]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add resident error:', err);
    res.status(500).json({ message: 'Failed to add resident' });
  }
});

// Update resident
router.put('/residents/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact_number, email, id_proof } = req.body;
  try {
    const result = await pool.query(
      `UPDATE residents
       SET name = $1, contact_number = $2, email = $3, id_proof = $4
       WHERE resident_id = $5 RETURNING *`,
      [name, contact_number, email, id_proof, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update resident error:', err);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

// Delete resident
router.delete('/residents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM residents WHERE resident_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete resident error:', err);
    res.status(500).json({ message: 'Failed to delete resident' });
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



module.exports = router;
