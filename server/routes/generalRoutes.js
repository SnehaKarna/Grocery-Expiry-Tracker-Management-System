const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, m.name as manufacturer_name, s.name as supplier_name
       FROM products p
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       ORDER BY p.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

module.exports = router; 