const express = require('express');
const router = express.Router();
const pool = require('../db');

// ======================= DASHBOARD STATISTICS =======================
router.get('/dashboard-stats/:org_id', async (req, res) => {
  const { org_id } = req.params;
  
  try {
    // Get total residents
    const residentsResult = await pool.query(
      `SELECT COUNT(*) as total_residents FROM residents r 
       JOIN plots p ON r.plot_id = p.plot_id 
       WHERE p.org_id = $1`,
      [org_id]
    );

    // Get total plots
    const plotsResult = await pool.query(
      'SELECT COUNT(*) as total_plots FROM plots WHERE org_id = $1',
      [org_id]
    );

    // Get total streets
    const streetsResult = await pool.query(
      'SELECT COUNT(*) as total_streets FROM streets WHERE org_id = $1',
      [org_id]
    );

    // Get pending payments
    const pendingPaymentsResult = await pool.query(
      `SELECT COUNT(*) as pending_count, COALESCE(SUM(amount), 0) as pending_amount 
       FROM payments p 
       JOIN plots pl ON p.plot_id = pl.plot_id 
       WHERE pl.org_id = $1 AND p.status = 'pending'`,
      [org_id]
    );

    // Get recent activities
    const recentActivities = await pool.query(
      `(SELECT 'payment' as activity_type, 
         CONCAT('Payment received from Plot ', pl.plot_no) as activity, 
         CONCAT('₹', p.amount, ' - ', p.payment_type) as details,
         p.created_at as activity_date
       FROM payments p 
       JOIN plots pl ON p.plot_id = pl.plot_id 
       WHERE pl.org_id = $1 AND p.status = 'paid'
       ORDER BY p.created_at DESC LIMIT 3)
       UNION ALL
       (SELECT 'resident' as activity_type,
         CONCAT('New resident registered: ', r.name) as activity,
         CONCAT('Plot ', pl.plot_no) as details,
         r.resident_id::text::timestamp as activity_date
       FROM residents r 
       JOIN plots pl ON r.plot_id = pl.plot_id 
       WHERE pl.org_id = $1
       ORDER BY r.resident_id DESC LIMIT 2)
       ORDER BY activity_date DESC LIMIT 5`,
      [org_id]
    );

    res.json({
      success: true,
      data: {
        totalResidents: parseInt(residentsResult.rows[0].total_residents),
        totalPlots: parseInt(plotsResult.rows[0].total_plots),
        totalStreets: parseInt(streetsResult.rows[0].total_streets),
        pendingPayments: {
          count: parseInt(pendingPaymentsResult.rows[0].pending_count),
          amount: parseFloat(pendingPaymentsResult.rows[0].pending_amount)
        },
        recentActivities: recentActivities.rows
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
});

// ======================= STREETS MANAGEMENT =======================
router.get('/streets/:org_id', async (req, res) => {
  const { org_id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT s.*, COUNT(p.plot_id) as plot_count 
       FROM streets s 
       LEFT JOIN plots p ON s.street_id = p.street_id 
       WHERE s.org_id = $1 
       GROUP BY s.street_id, s.street_name 
       ORDER BY s.street_name`,
      [org_id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch streets error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch streets' });
  }
});

router.post('/streets', async (req, res) => {
  const { org_id, street_name } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO streets (org_id, street_name) VALUES ($1, $2) RETURNING *',
      [org_id, street_name]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create street error:', error);
    res.status(500).json({ success: false, message: 'Failed to create street' });
  }
});

router.put('/streets/:street_id', async (req, res) => {
  const { street_id } = req.params;
  const { street_name } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE streets SET street_name = $1 WHERE street_id = $2 RETURNING *',
      [street_name, street_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Street not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update street error:', error);
    res.status(500).json({ success: false, message: 'Failed to update street' });
  }
});

router.delete('/streets/:street_id', async (req, res) => {
  const { street_id } = req.params;
  
  try {
    // Check if street has plots
    const plotCheck = await pool.query(
      'SELECT COUNT(*) as plot_count FROM plots WHERE street_id = $1',
      [street_id]
    );
    
    if (parseInt(plotCheck.rows[0].plot_count) > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete street with existing plots' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM streets WHERE street_id = $1 RETURNING *',
      [street_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Street not found' });
    }
    
    res.json({ success: true, message: 'Street deleted successfully' });
  } catch (error) {
    console.error('Delete street error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete street' });
  }
});

// ======================= PLOTS MANAGEMENT =======================
router.get('/plots/:org_id', async (req, res) => {
  const { org_id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT p.*, s.street_name, 
       COUNT(DISTINCT r.resident_id) as resident_count,
       COUNT(DISTINCT f.flat_id) as flat_count
       FROM plots p 
       LEFT JOIN streets s ON p.street_id = s.street_id 
       LEFT JOIN residents r ON p.plot_id = r.plot_id 
       LEFT JOIN flats f ON p.plot_id = f.plot_id 
       WHERE p.org_id = $1 
       GROUP BY p.plot_id, s.street_name 
       ORDER BY s.street_name, p.plot_no`,
      [org_id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch plots error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch plots' });
  }
});

router.post('/plots', async (req, res) => {
  const { org_id, street_id, plot_type, plot_no } = req.body;
  
  try {
    // Check if plot number already exists in the street
    const plotCheck = await pool.query(
      'SELECT * FROM plots WHERE street_id = $1 AND plot_no = $2',
      [street_id, plot_no]
    );
    
    if (plotCheck.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Plot number already exists in this street' 
      });
    }
    
    const result = await pool.query(
      'INSERT INTO plots (org_id, street_id, plot_type, plot_no) VALUES ($1, $2, $3, $4) RETURNING *',
      [org_id, street_id, plot_type, plot_no]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create plot error:', error);
    res.status(500).json({ success: false, message: 'Failed to create plot' });
  }
});

router.put('/plots/:plot_id', async (req, res) => {
  const { plot_id } = req.params;
  const { street_id, plot_type, plot_no } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE plots SET street_id = $1, plot_type = $2, plot_no = $3 WHERE plot_id = $4 RETURNING *',
      [street_id, plot_type, plot_no, plot_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update plot error:', error);
    res.status(500).json({ success: false, message: 'Failed to update plot' });
  }
});

router.delete('/plots/:plot_id', async (req, res) => {
  const { plot_id } = req.params;
  
  try {
    // Check if plot has residents
    const residentCheck = await pool.query(
      'SELECT COUNT(*) as resident_count FROM residents WHERE plot_id = $1',
      [plot_id]
    );
    
    if (parseInt(residentCheck.rows[0].resident_count) > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete plot with existing residents' 
      });
    }
    
    const result = await pool.query(
      'DELETE FROM plots WHERE plot_id = $1 RETURNING *',
      [plot_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }
    
    res.json({ success: true, message: 'Plot deleted successfully' });
  } catch (error) {
    console.error('Delete plot error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete plot' });
  }
});

// ======================= FLATS MANAGEMENT =======================
router.get('/flats/:plot_id', async (req, res) => {
  const { plot_id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM flats WHERE plot_id = $1 ORDER BY flat_no',
      [plot_id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch flats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch flats' });
  }
});

router.post('/flats', async (req, res) => {
  const { plot_id, flat_no, eb_card } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO flats (plot_id, flat_no, eb_card) VALUES ($1, $2, $3) RETURNING *',
      [plot_id, flat_no, eb_card]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create flat error:', error);
    res.status(500).json({ success: false, message: 'Failed to create flat' });
  }
});

// ======================= RESIDENTS MANAGEMENT =======================
router.get('/residents/:org_id', async (req, res) => {
  const { org_id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT r.*, p.plot_no, s.street_name, f.flat_no 
       FROM residents r 
       JOIN plots p ON r.plot_id = p.plot_id 
       LEFT JOIN streets s ON p.street_id = s.street_id 
       LEFT JOIN flats f ON r.flat_id = f.flat_id 
       WHERE p.org_id = $1 
       ORDER BY s.street_name, p.plot_no, f.flat_no`,
      [org_id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch residents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch residents' });
  }
});

router.post('/residents', async (req, res) => {
  const { plot_id, flat_id, name, contact_number, email, id_proof } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO residents (plot_id, flat_id, name, contact_number, email, id_proof) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [plot_id, flat_id, name, contact_number, email, id_proof]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create resident error:', error);
    res.status(500).json({ success: false, message: 'Failed to create resident' });
  }
});

router.put('/residents/:resident_id', async (req, res) => {
  const { resident_id } = req.params;
  const { name, contact_number, email, id_proof } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE residents SET name = $1, contact_number = $2, email = $3, id_proof = $4 
       WHERE resident_id = $5 RETURNING *`,
      [name, contact_number, email, id_proof, resident_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({ success: false, message: 'Failed to update resident' });
  }
});

router.delete('/residents/:resident_id', async (req, res) => {
  const { resident_id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM residents WHERE resident_id = $1 RETURNING *',
      [resident_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }
    
    res.json({ success: true, message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resident' });
  }
});

// ======================= PAYMENTS MANAGEMENT =======================
router.get('/payments/:org_id', async (req, res) => {
  const { org_id } = req.params;
  const { status, page = 1, limit = 10 } = req.query;
  
  try {
    let query = `
      SELECT p.*, pl.plot_no, s.street_name, r.name as resident_name 
      FROM payments p 
      JOIN plots pl ON p.plot_id = pl.plot_id 
      LEFT JOIN streets s ON pl.street_id = s.street_id 
      LEFT JOIN residents r ON p.resident_id = r.resident_id 
      WHERE pl.org_id = $1
    `;
    
    const queryParams = [org_id];
    
    if (status) {
      query += ' AND p.status = $2';
      queryParams.push(status);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await pool.query(query, queryParams);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM payments p 
      JOIN plots pl ON p.plot_id = pl.plot_id 
      WHERE pl.org_id = $1
    `;
    
    const countParams = [org_id];
    if (status) {
      countQuery += ' AND p.status = $2';
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({ 
      success: true, 
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

router.post('/payments', async (req, res) => {
  const { plot_id, resident_id, amount, payment_type, due_date, payment_method, notes } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO payments (plot_id, resident_id, amount, payment_type, due_date, payment_method, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [plot_id, resident_id, amount, payment_type, due_date, payment_method, notes]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
});

router.put('/payments/:payment_id', async (req, res) => {
  const { payment_id } = req.params;
  const { status, payment_method, transaction_id, notes } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE payments SET status = $1, payment_method = $2, transaction_id = $3, notes = $4 
       WHERE payment_id = $5 RETURNING *`,
      [status, payment_method, transaction_id, notes, payment_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment' });
  }
});

// ======================= HELPER ROUTES =======================
router.get('/streets-dropdown/:org_id', async (req, res) => {
  const { org_id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT street_id, street_name FROM streets WHERE org_id = $1 ORDER BY street_name',
      [org_id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch streets dropdown error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch streets' });
  }
});

router.get('/plots-dropdown/:org_id', async (req, res) => {
  const { org_id } = req.params;
  const { street_id } = req.query;
  
  try {
    let query = 'SELECT plot_id, plot_no FROM plots WHERE org_id = $1';
    const params = [org_id];
    
    if (street_id) {
      query += ' AND street_id = $2';
      params.push(street_id);
    }
    
    query += ' ORDER BY plot_no';
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch plots dropdown error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch plots' });
  }
});

module.exports = router;