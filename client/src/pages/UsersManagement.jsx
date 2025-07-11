import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      if (editingUserId) {
        await api.put(`/admin/users/${editingUserId}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }

      setFormData({ name: '', email: '', password: '' });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, password: '' });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="users-management">
      <h2>Users Management</h2>

      <form className="user-form" onSubmit={handleAddOrUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editingUserId ? "Enter new password or leave blank" : "Password"}
          value={formData.password}
          onChange={handleChange}
          required={!editingUserId}
        />
        {error && <p className="error-msg">{error}</p>}
        <div className="form-buttons">
          <button type="submit">{editingUserId ? 'Update User' : 'Add User'}</button>
          {editingUserId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4">No users found</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
