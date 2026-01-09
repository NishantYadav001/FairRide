import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_EMAIL } from './constants';

const Layout = ({ children }) => {
  const location = useLocation();
  const email = localStorage.getItem('userEmail') || '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = email === ADMIN_EMAIL;

  const isActive = (path) => (location.pathname === path ? 'active' : '');
  // sidebar stays on the left
  const sidebarClass = 'sidebar';

  return (
    <div className="app-layout">
      <aside className={sidebarClass}>
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
        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          {!isLoggedIn ? (
            <>
              <button
                className="sidebar-auth-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
              >
                Login
              </button>
              <button
                className="sidebar-auth-btn primary"
                style={{ marginTop: 8 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openSignup'))}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                {localStorage.getItem('userName') || localStorage.getItem('userEmail')}
              </div>
              <button
                className="sidebar-auth-btn"
                onClick={() => {
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userName');
                  localStorage.removeItem('isLoggedIn');
                  // reload so app picks new state
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
