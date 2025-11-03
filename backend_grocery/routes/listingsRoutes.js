const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get all items
router.get('/items', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grocery_store');
    res.json(result.rows);
  } catch (err) {
    console.error('Grocery fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

module.exports = router;
