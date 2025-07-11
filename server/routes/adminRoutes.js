const express = require('express');
const router = express.Router();
const pool = require('../db');

////////////////////////////
// 🔐 Admin Login
////////////////////////////
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'admin123') {
    return res.status(200).json({ role: 'admin', message: 'Admin login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

////////////////////////////
// USERS CRUD
////////////////////////////
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
    res.json({ message: 'User added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    await pool.query('UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4', [name, email, password, id]);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

////////////////////////////
// MANUFACTURERS CRUD
////////////////////////////
router.get('/manufacturers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM manufacturers ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching manufacturers', error });
  }
});

router.post('/manufacturers', async (req, res) => {
  try {
    const { name, contact_info, location } = req.body;
    await pool.query('INSERT INTO manufacturers (name, contact_info, location) VALUES ($1, $2, $3)', [name, contact_info, location]);
    res.json({ message: 'Manufacturer added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding manufacturer', error });
  }
});

router.put('/manufacturers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info, location } = req.body;
    await pool.query('UPDATE manufacturers SET name=$1, contact_info=$2, location=$3 WHERE id=$4', [name, contact_info, location, id]);
    res.json({ message: 'Manufacturer updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating manufacturer', error });
  }
});

router.delete('/manufacturers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM manufacturers WHERE id=$1', [id]);
    res.json({ message: 'Manufacturer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting manufacturer', error });
  }
});

////////////////////////////
// SUPPLIERS CRUD
////////////////////////////
router.get('/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
});

router.post('/suppliers', async (req, res) => {
  try {
    const { name, contact_info, manufacturer_id } = req.body;
    await pool.query('INSERT INTO suppliers (name, contact_info, manufacturer_id) VALUES ($1, $2, $3)', [name, contact_info, manufacturer_id]);
    res.json({ message: 'Supplier added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding supplier', error });
  }
});

router.put('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info, manufacturer_id } = req.body;
    await pool.query('UPDATE suppliers SET name=$1, contact_info=$2, manufacturer_id=$3 WHERE id=$4', [name, contact_info, manufacturer_id, id]);
    res.json({ message: 'Supplier updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
});

router.delete('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM suppliers WHERE id=$1', [id]);
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
});

////////////////////////////
// PRODUCTS CRUD
////////////////////////////
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, category, manufacture_date, expiry_date, manufacturer_id, supplier_id } = req.body;
    await pool.query(
      `INSERT INTO products (name, category, manufacture_date, expiry_date, manufacturer_id, supplier_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, category, manufacture_date, expiry_date, manufacturer_id, supplier_id]
    );
    res.json({ message: 'Product added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, manufacture_date, expiry_date, manufacturer_id, supplier_id } = req.body;
    await pool.query(
      `UPDATE products SET name=$1, category=$2, manufacture_date=$3, expiry_date=$4, manufacturer_id=$5, supplier_id=$6
       WHERE id=$7`,
      [name, category, manufacture_date, expiry_date, manufacturer_id, supplier_id, id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

////////////////////////////
// USER PRODUCTS CRUD
////////////////////////////
router.get('/user-products', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT up.id, up.user_id, up.product_id, p.name AS product_name, p.category, p.expiry_date, up.quantity, up.purchase_date, u.name as user_name
       FROM user_products up
       JOIN products p ON up.product_id = p.id
       JOIN users u ON up.user_id = u.id
       ORDER BY up.purchase_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Error fetching user products', error: error.message });
  }
});

router.post('/user-products', async (req, res) => {
  try {
    const { user_id, product_id, quantity, purchase_date } = req.body;
    await pool.query(
      'INSERT INTO user_products (user_id, product_id, quantity, purchase_date) VALUES ($1, $2, $3, $4)',
      [user_id, product_id, quantity, purchase_date]
    );
    res.json({ message: 'User product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user product', error });
  }
});

router.put('/user-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, product_id, quantity, purchase_date } = req.body;
    await pool.query(
      'UPDATE user_products SET user_id=$1, product_id=$2, quantity=$3, purchase_date=$4 WHERE id=$5',
      [user_id, product_id, quantity, purchase_date, id]
    );
    res.json({ message: 'User product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user product', error });
  }
});

router.delete('/user-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM user_products WHERE id=$1', [id]);
    res.json({ message: 'User product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user product', error });
  }
});

module.exports = router;
