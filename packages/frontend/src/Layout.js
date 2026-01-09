import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_EMAIL } from './constants';

const Layout = ({ children }) => {
  const location = useLocation();
  const email = localStorage.getItem('userEmail') || '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = email === ADMIN_EMAIL;

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isLoggedIn ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <span aria-hidden="true">🚗</span>
          <span>FairRide</span>
        </div>
        <nav className="sidebar-nav">
          <Link className={`sidebar-item ${isActive('/')}`} to="/">
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-label">Home</span>
          </Link>
          <Link className={`sidebar-item ${isActive('/dashboard')}`} to="/dashboard">
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-label">Dashboard</span>
          </Link>
          <Link className={`sidebar-item ${isActive('/history')}`} to="/history">
            <span className="sidebar-icon">🕒</span>
            <span className="sidebar-label">History</span>
          </Link>
          <Link className={`sidebar-item ${isActive('/profile')}`} to="/profile">
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-label">Profile</span>
          </Link>
          <Link className={`sidebar-item ${isActive('/about')}`} to="/about">
            <span className="sidebar-icon">ℹ️</span>
            <span className="sidebar-label">About</span>
          </Link>
          {isAdmin && (
            <Link className={`sidebar-item ${isActive('/admin')}`} to="/admin">
              <span className="sidebar-icon">🛠️</span>
              <span className="sidebar-label">Admin</span>
            </Link>
          )}
        </nav>
      </aside>
      <main className={`main-content ${isLoggedIn ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
