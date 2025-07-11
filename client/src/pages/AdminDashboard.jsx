import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🏪 Admin Control Panel</h1>
        <p className="dashboard-subtitle">Manage your grocery tracking system efficiently</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card" onClick={() => navigate('/admin/users')}>
          <div className="card-icon">👥</div>
          <h3>Users</h3>
          <p>Manage user accounts and permissions</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/admin/manufacturers')}>
          <div className="card-icon">🏭</div>
          <h3>Manufacturers</h3>
          <p>Track product manufacturers and their details</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/admin/suppliers')}>
          <div className="card-icon">🚚</div>
          <h3>Suppliers</h3>
          <p>Manage product suppliers and distributions</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/admin/products')}>
          <div className="card-icon">📦</div>
          <h3>Products</h3>
          <p>Maintain product catalog and inventory</p>
        </div>

        
      </div>

      <div className="quick-stats">
        <div className="stats-header">
          <h2>System Overview</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Quick Actions</h4>
            <ul className="action-list">
              <li>View system status</li>
              <li>Monitor user activity</li>
              <li>Track expiring products</li>
              <li>Manage inventory levels</li>
            </ul>
          </div>
          <div className="stat-card">
            <h4>Admin Tools</h4>
            <ul className="action-list">
              <li>User management</li>
              <li>Product catalog</li>
              <li>Supply chain tracking</li>
              <li>Expiry notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
