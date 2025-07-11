import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>🛒 Smart Grocery Tracker</h1>
        <p className="tagline">Track, Manage, and Never Waste Again</p>
        
          <div className="login-section">
          <div className="login-card">
            <h3>For Shoppers</h3>
            <p>Track your groceries, get expiry notifications, and manage your inventory</p>
            <button className="user-btn" onClick={() => navigate('/user-login')}>
              User Login
            </button>
          </div>

          <div className="login-card">
            <h3>For Administrators</h3>
            <p>Manage products, manufacturers, and suppliers in the system</p>
            <button className="admin-btn" onClick={() => navigate('/admin-login')}>
              Admin Login
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Expiry Tracking</h3>
            <p>Never let your groceries go to waste. Get timely notifications before items expire.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📦</span>
            <h3>Inventory Management</h3>
            <p>Keep track of all your purchases, quantities, and categories in one place.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔔</span>
            <h3>Smart Notifications</h3>
            <p>Get alerts 7 days before your products expire. Stay informed, stay organized.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Detailed Analytics</h3>
            <p>View your shopping patterns and manage your grocery inventory efficiently.</p>
          </div>
        </div>

 

        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>For Users</h4>
              <ul>
                <li>Track grocery expiry dates</li>
                <li>Manage purchase history</li>
                <li>Get expiry notifications</li>
                <li>Monitor inventory levels</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>For Admins</h4>
              <ul>
                <li>Manage product catalog</li>
                <li>Track manufacturers</li>
                <li>Monitor suppliers</li>
                <li>System oversight</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
