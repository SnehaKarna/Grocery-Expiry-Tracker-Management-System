import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiringProducts: 0,
    expiredProducts: 0
  });
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const calculateExpiryStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    // Reset hours to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    thirtyDaysFromNow.setHours(0, 0, 0, 0);

    if (expiry <= now) {
      return { status: 'Expired', statusClass: 'status-expired' };
    } else if (expiry <= thirtyDaysFromNow) {
      return { status: 'Expiring Soon', statusClass: 'status-warning' };
    }
    return { status: 'Active', statusClass: '' };
  };

  const updateStats = (products) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const expiringProducts = products.filter(p => {
      const expiryDate = new Date(p.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate > now && expiryDate <= thirtyDaysFromNow;
    });

    const expiredProducts = products.filter(p => {
      const expiryDate = new Date(p.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate <= now;
    });

    setStats({
      totalProducts: products.length,
      expiringProducts: expiringProducts.length,
      expiredProducts: expiredProducts.length
    });

    // Update notifications with expiring products
    const notificationItems = expiringProducts.map(p => ({
      id: p.id,
      product_name: p.product_name,
      expiry_date: p.expiry_date,
      priority: new Date(p.expiry_date) <= new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)) ? 'high' : 'normal'
    }));

    // Update expired items
    const expiredItems = expiredProducts.map(p => ({
      id: p.id,
      product_name: p.product_name,
      expiry_date: p.expiry_date
    }));

    setNotifications(notificationItems);
    setExpiredItems(expiredItems);
  };

  useEffect(() => {
    if (!userId) {
      // Redirect to login if no userId
      window.location.href = '/user-login';
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch available products
        const productsRes = await api.get('/products');
        setProducts(productsRes.data);

        // Fetch user products
        const userProductsRes = await api.get(`/user/products/${userId}`);
        setUserProducts(userProductsRes.data);

        // Calculate stats and notifications
        updateStats(userProductsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    setFormData(prev => ({ ...prev, product_id: productId }));
    setSelectedProduct(products.find(p => p.id === parseInt(productId)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let updatedProduct;
      
      if (editingProduct) {
        // Update existing product
        const res = await api.put(`/user/products/${editingProduct.id}`, {
          quantity: editingProduct.quantity,
          purchase_date: editingProduct.purchase_date
        });
        updatedProduct = res.data.product;
        
        // Update the products list
        setUserProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
        );
        
        // Clear edit mode
        setEditingProduct(null);
        setSelectedProduct(null);
        showSuccessMessage('Product updated successfully!');
      } else {
        // Add new product
        const res = await api.post('/user/add-product', {
          user_id: userId,
          ...formData
        });

        if (res.data.product) {
          updatedProduct = res.data.product;
          setUserProducts(prev => [updatedProduct, ...prev]);
          
          // Clear form
          setFormData({
            product_id: '',
            quantity: '',
            purchase_date: new Date().toISOString().split('T')[0]
          });
          setSelectedProduct(null);
          showSuccessMessage('Product added successfully!');
        }
      }

      // Update stats with the new product list
      if (updatedProduct) {
        const updatedProducts = editingProduct 
          ? userProducts.map(p => p.id === editingProduct.id ? updatedProduct : p)
          : [updatedProduct, ...userProducts];
        updateStats(updatedProducts);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      purchase_date: product.purchase_date.split('T')[0]
    });
    setSelectedProduct({
      id: product.product_id,
      name: product.product_name,
      category: product.category,
      expiry_date: product.expiry_date
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete(`/user/products/${productId}`);
      
      // Update local state
      const updatedProducts = userProducts.filter(p => p.id !== productId);
      setUserProducts(updatedProducts);
      
      // Update stats
      updateStats(updatedProducts);
      
      // Show success message
      showSuccessMessage('Product deleted successfully!');
      
      // If we were editing this product, clear the form
      if (editingProduct && editingProduct.id === productId) {
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      product_id: '',
      quantity: '',
      purchase_date: new Date().toISOString().split('T')[0]
    });
    setSelectedProduct(null);
  };

  if (loading && !userProducts.length) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-welcome">
          <h1>Welcome back, {userName || 'User'} 👋</h1>
          <p className="header-subtitle">Here's what's happening with your products</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{stats.expiringProducts}</span>
            <span className="stat-label">Expiring Soon</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-value">{stats.expiredProducts}</span>
            <span className="stat-label">Expired</span>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="dashboard-grid">
        <div className="top-row-container">
          <section className="add-product card">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product">Select Product:</label>
                <select 
                  id="product"
                  name="product_id" 
                  value={editingProduct ? editingProduct.product_id : formData.product_id} 
                  onChange={handleProductSelect} 
                  required
                  disabled={loading || editingProduct}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {(selectedProduct || editingProduct) && (
                <div className="product-info">
                  <p><strong>Category:</strong> {(editingProduct || selectedProduct).category || 'N/A'}</p>
                  <p><strong>Expiry Date:</strong> {new Date((editingProduct || selectedProduct).expiry_date).toLocaleDateString()}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input 
                  id="quantity"
                  type="number" 
                  name="quantity" 
                  min="1"
                  placeholder="Enter quantity" 
                  value={editingProduct ? editingProduct.quantity : formData.quantity} 
                  onChange={handleChange} 
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchase_date">Purchase Date:</label>
                <input 
                  id="purchase_date"
                  type="date" 
                  name="purchase_date" 
                  value={editingProduct ? editingProduct.purchase_date.split('T')[0] : formData.purchase_date} 
                  onChange={handleChange} 
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit} disabled={loading}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="notifications card">
            <h2>Expiring Soon</h2>
            {notifications.length > 0 ? (
              <div className="notification-list">
                {notifications.map(n => (
                  <div key={n.id} className={`notification-item ${n.priority === 'high' ? 'urgent' : ''}`}>
                    <h3>{n.product_name}</h3>
                    <p className="expiry-date">Expiring on {new Date(n.expiry_date).toLocaleDateString()}</p>
                    <p className="priority-indicator">{n.priority === 'high' ? 'Action needed soon!' : 'Keep an eye on this'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No products expiring soon</p>
            )}
          </section>

          <section className="expired-items card">
            <h2>Expired Items</h2>
            {expiredItems.length > 0 ? (
              <div className="notification-list">
                {expiredItems.map(item => (
                  <div key={item.id} className="notification-item expired">
                    <h3>{item.product_name}</h3>
                    <p className="expiry-date">Expired on {new Date(item.expiry_date).toLocaleDateString()}</p>
                    <p className="priority-indicator">Please dispose of this item</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No expired products</p>
            )}
          </section>
        </div>

        <section className="user-products card">
          <h2>Your Products</h2>
          {userProducts.length > 0 ? (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Purchase Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userProducts.map(up => {
                    const { status, statusClass } = calculateExpiryStatus(up.expiry_date);

                    return (
                      <tr key={up.id}>
                        <td>{up.product_name}</td>
                        <td>{up.category || 'N/A'}</td>
                        <td>{up.quantity}</td>
                        <td>{new Date(up.purchase_date).toLocaleDateString()}</td>
                        <td>{new Date(up.expiry_date).toLocaleDateString()}</td>
                        <td><span className={`status-badge ${statusClass}`}>{status}</span></td>
                        <td className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(up)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(up.id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No products added yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
