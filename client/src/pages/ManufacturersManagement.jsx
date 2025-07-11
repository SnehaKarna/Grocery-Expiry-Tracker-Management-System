import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './ManufacturersManagement.css';

const ManufacturersManagement = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({ name: '', contact_info: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchManufacturers();
  }, []);

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
      setError('Name is required');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/manufacturers/${editingId}`, formData);
      } else {
        await api.post('/admin/manufacturers', formData);
      }

      setFormData({ name: '', contact_info: '', location: '' });
      setEditingId(null);
      fetchManufacturers();
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleEdit = (m) => {
    setFormData({
      name: m.name || '',
      contact_info: m.contact_info || '',
      location: m.location || '',
    });
    setEditingId(m.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manufacturer?')) return;

    try {
      await api.delete(`/admin/manufacturers/${id}`);
      fetchManufacturers();
    } catch {
      alert('Server error');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', contact_info: '', location: '' });
    setError('');
  };

  return (
    <div className="manufacturers-management">
      <h2>Manufacturers Management</h2>

      <form onSubmit={handleAddOrUpdate} className="manufacturer-form">
        <input
          type="text"
          name="name"
          placeholder="Name *"
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
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        {error && <p className="error-msg">{error}</p>}
        <div className="form-buttons">
          <button type="submit">{editingId ? 'Update Manufacturer' : 'Add Manufacturer'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="manufacturers-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Contact Info</th><th>Location</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manufacturers.length === 0 ? (
            <tr><td colSpan="5">No manufacturers found</td></tr>
          ) : (
            manufacturers.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.contact_info || '-'}</td>
                <td>{m.location || '-'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(m)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManufacturersManagement;
