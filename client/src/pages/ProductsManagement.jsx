import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacture_date: '',
    expiry_date: '',
    manufacturer_id: '',
    supplier_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchManufacturers();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  const fetchManufacturers = async () => {
    try {
      const res = await api.get('/admin/manufacturers');
      setManufacturers(res.data);
    } catch (err) {
      console.error('Error fetching manufacturers:', err);
      setError('Failed to fetch manufacturers');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/admin/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.manufacturer_id || !formData.supplier_id) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }

      setFormData({
        name: '',
        category: '',
        manufacture_date: '',
        expiry_date: '',
        manufacturer_id: '',
        supplier_id: '',
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      category: product.category || '',
      manufacture_date: product.manufacture_date ? product.manufacture_date.slice(0, 10) : '',
      expiry_date: product.expiry_date ? product.expiry_date.slice(0, 10) : '',
      manufacturer_id: product.manufacturer_id ? product.manufacturer_id.toString() : '',
      supplier_id: product.supplier_id ? product.supplier_id.toString() : '',
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      manufacture_date: '',
      expiry_date: '',
      manufacturer_id: '',
      supplier_id: '',
    });
    setError('');
  };

  return (
    <div className="products-management">
      <h2>Products Management</h2>

      <form onSubmit={handleAddOrUpdate} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="date"
          name="manufacture_date"
          placeholder="Manufacture Date"
          value={formData.manufacture_date}
          onChange={handleChange}
        />
        <input
          type="date"
          name="expiry_date"
          placeholder="Expiry Date"
          value={formData.expiry_date}
          onChange={handleChange}
        />
        <select
          name="manufacturer_id"
          value={formData.manufacturer_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Manufacturer *</option>
          {manufacturers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <select
          name="supplier_id"
          value={formData.supplier_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier *</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-buttons">
          <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Manufacture Date</th>
            <th>Expiry Date</th>
            <th>Manufacturer</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No products found</td>
            </tr>
          )}
          {products.map(product => {
            const manufacturer = manufacturers.find(m => m.id === product.manufacturer_id);
            const supplier = suppliers.find(s => s.id === product.supplier_id);

            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category || '-'}</td>
                <td>{product.manufacture_date ? product.manufacture_date.slice(0, 10) : '-'}</td>
                <td>{product.expiry_date ? product.expiry_date.slice(0, 10) : '-'}</td>
                <td>{manufacturer ? manufacturer.name : '-'}</td>
                <td>{supplier ? supplier.name : '-'}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsManagement;
