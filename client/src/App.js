import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminDashboard from './pages/AdminDashboard';

import UsersManagement from './pages/UsersManagement';
import ManufacturersManagement from './pages/ManufacturersManagement';
import SuppliersManagement from './pages/SuppliersManagement';
import ProductsManagement from './pages/ProductsManagement';
import UserProductsManagement from './pages/UserProductsManagement';

import UserDashboard from './pages/UserDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />

        <Route path="/admin" element={<AdminDashboard />} />

        {/* Admin nested CRUD routes */}
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/manufacturers" element={<ManufacturersManagement />} />
        <Route path="/admin/suppliers" element={<SuppliersManagement />} />
        <Route path="/admin/products" element={<ProductsManagement />} />
        <Route path="/admin/user-products" element={<UserProductsManagement />} />

        {/* No user dashboard route yet */}

        <Route path="/user/dashboard" element={<UserDashboard />} />

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
