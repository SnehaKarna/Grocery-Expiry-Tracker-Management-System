import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './SuppliersManagement.css';

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({ name: '', contact_info: '', manufacturer_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchManufacturers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/admin/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers');
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Supplier name is required');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/suppliers/${editingId}`, formData);
      } else {
        await api.post('/admin/suppliers', formData);
      }

      setFormData({ name: '', contact_info: '', manufacturer_id: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || '',
      contact_info: supplier.contact_info || '',
      manufacturer_id: supplier.manufacturer_id ? supplier.manufacturer_id.toString() : '',
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await api.delete(`/admin/suppliers/${id}`);
      fetchSuppliers();
    } catch {
      alert('Server error');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', contact_info: '', manufacturer_id: '' });
    setError('');
  };

  return (
    <div className="suppliers-management">
      <h2>Suppliers Management</h2>

      <form onSubmit={handleAddOrUpdate} className="supplier-form">
        <input
          type="text"
          name="name"
          placeholder="Supplier Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
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
        {error && <p className="error-msg">{error}</p>}
        <div className="form-buttons">
          <button type="submit">{editingId ? 'Update Supplier' : 'Add Supplier'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="suppliers-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Contact Info</th><th>Manufacturer</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr><td colSpan="5">No suppliers found</td></tr>
          ) : (
            suppliers.map(s => {
              const manufacturer = manufacturers.find(m => m.id === s.manufacturer_id);
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.contact_info || '-'}</td>
                  <td>{manufacturer ? manufacturer.name : '-'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuppliersManagement;
