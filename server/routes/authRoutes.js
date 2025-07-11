const express = require('express');
const router = express.Router();
const pool = require('../db');

// Admin login
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'admin123') {
    return res.status(200).json({ role: 'admin', message: 'Admin login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// User login
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ role: 'user', userId: user.id, name: user.name, message: 'User login successful' });
    } else {
      res.status(401).json({ message: 'Invalid user credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error during user login', error: err });
  }
});

module.exports = router;
