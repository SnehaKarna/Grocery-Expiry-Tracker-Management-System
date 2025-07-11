const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add purchased product
router.post('/add-product', async (req, res) => {
  const { user_id, product_id, quantity, purchase_date } = req.body;
  
  try {
    // Validate required fields
    if (!user_id || !product_id || !quantity || !purchase_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // First check if the product exists
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add the product for the user
    const result = await pool.query(
      `INSERT INTO user_products (user_id, product_id, quantity, purchase_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [user_id, product_id, quantity, purchase_date]
    );

    // Get the added product details
    const addedProduct = await pool.query(
      `SELECT up.id, up.product_id, p.name AS product_name, p.category, p.expiry_date, up.quantity, up.purchase_date
       FROM user_products up
       JOIN products p ON up.product_id = p.id
       WHERE up.id = $1`,
      [result.rows[0].id]
    );

    res.json({
      message: 'Product added successfully',
      product: addedProduct.rows[0]
    });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.constraint === 'user_products_user_id_fkey') {
      res.status(400).json({ message: 'Invalid user ID' });
    } else if (error.constraint === 'user_products_product_id_fkey') {
      res.status(400).json({ message: 'Invalid product ID' });
    } else {
      res.status(500).json({ message: 'Error adding product', error: error.message });
    }
  }
});

// View user's added products
router.get('/products/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT up.id, up.product_id, p.name AS product_name, p.category, p.expiry_date, up.quantity, up.purchase_date
       FROM user_products up
       JOIN products p ON up.product_id = p.id
       WHERE up.user_id = $1
       ORDER BY up.purchase_date DESC`, 
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Error fetching user products', error: error.message });
  }
});

// Update user product
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, purchase_date } = req.body;
  
  try {
    // First check if the product exists
    const productCheck = await pool.query('SELECT * FROM user_products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product
    await pool.query(
      `UPDATE user_products 
       SET quantity = $1, purchase_date = $2
       WHERE id = $3`,
      [quantity, purchase_date, id]
    );

    // Get the updated product details
    const updatedProduct = await pool.query(
      `SELECT up.id, up.product_id, p.name AS product_name, p.category, p.expiry_date, up.quantity, up.purchase_date
       FROM user_products up
       JOIN products p ON up.product_id = p.id
       WHERE up.id = $1`,
      [id]
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct.rows[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete user product
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // First check if the product exists
    const productCheck = await pool.query('SELECT * FROM user_products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product
    await pool.query('DELETE FROM user_products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Notifications for expiring products
router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT n.id, p.name AS product_name, p.category, p.expiry_date, n.message, n.created_at, n.priority
       FROM notifications n
       JOIN products p ON n.product_id = p.id
       WHERE n.user_id = $1 AND n.is_read = FALSE
       AND p.expiry_date <= CURRENT_DATE + INTERVAL '7 days'
       ORDER BY p.expiry_date ASC`, 
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

module.exports = router;
