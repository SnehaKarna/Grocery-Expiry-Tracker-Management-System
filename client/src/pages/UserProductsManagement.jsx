import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './UserProductsManagement.css';

const UserProductsManagement = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    id: null,
    user_id: '',
    product_id: '',
    quantity: '',
    purchase_date: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user_products, users, and products on mount
  useEffect(() => {
    fetchUserProducts();
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      console.log('Fetching user products...');
      const res = await api.get('/admin/user-products');
      console.log('User products response:', res.data);
      setUserProducts(res.data);
    } catch (err) {
      console.error('Error fetching user products:', err.response || err);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const res = await api.get('/admin/users');
      console.log('Users response:', res.data);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.response || err);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const res = await api.get('/admin/products');
      console.log('Products response:', res.data);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err.response || err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/user-products', formData);
      fetchUserProducts();
      setFormData({ id: null, user_id: '', product_id: '', quantity: '', purchase_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      purchase_date: item.purchase_date ? item.purchase_date.split('T')[0] : '',
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/user-products/${formData.id}`, formData);
      fetchUserProducts();
      setFormData({ id: null, user_id: '', product_id: '', quantity: '', purchase_date: '' });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this user product?')) return;
    try {
      await api.delete(`/admin/user-products/${id}`);
      fetchUserProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-products-management">
      <h1>User Products Management</h1>

      <form onSubmit={isEditing ? handleUpdate : handleAdd} className="user-products-form">
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>

        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          min="1"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="purchase_date"
          value={formData.purchase_date}
          onChange={handleChange}
          required
        />

        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: null, user_id: '', product_id: '', quantity: '', purchase_date: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="user-products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Purchase Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userProducts.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.user_name || item.user_id}</td>
              <td>{item.product_name || item.product_id}</td>
              <td>{item.quantity}</td>
              <td>{item.purchase_date ? item.purchase_date.split('T')[0] : ''}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{marginLeft: '10px', color: 'red'}}>Delete</button>
              </td>
            </tr>
          ))}
          {userProducts.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No user products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserProductsManagement;
