import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const email = localStorage.getItem('userEmail') || '';
  const name = localStorage.getItem('userName') || '';
  // load user history from localStorage
  const historyKey = 'tripHistory';
  let userHistory = [];
  try {
    const raw = localStorage.getItem(historyKey);
    const all = raw ? JSON.parse(raw) : {};
    userHistory = (email && Array.isArray(all[email])) ? all[email] : [];
  } catch (e) {
    console.error('Could not read trip history', e);
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, {name || (email ? email.split('@')[0] : 'User')}!</h1>
            <Link to="/" className="new-comparison-btn">
              New Comparison
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-value">₹0</div>
              <div className="stat-card-label">Total Saved</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{userHistory.length}</div>
              <div className="stat-card-label">Trips Taken</div>
              <div className="stat-card-sublabel">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">4.8⭐</div>
              <div className="stat-card-label">Avg Rating</div>
            </div>
          </div>

          <div className="recent-trips">
            <div className="recent-trips-header">
              <h2>Recent Trips</h2>
            </div>
            <div className="trip-list">
              {userHistory.length === 0 ? (
                <div className="empty-state">No trips yet. Use the Compare tool to add your first trip.</div>
              ) : (
                userHistory.slice(0, 5).map((t) => (
                  <div className="trip-item" key={t.id}>
                    <div className={`provider-logo ${t.cheapestProvider ? t.cheapestProvider.toLowerCase() : 'ola'}-logo`}>{(t.cheapestProvider||'OLA').toUpperCase()}</div>
                    <div className="trip-details">
                      <div className="trip-route">{t.route}</div>
                      <div className="trip-timestamp">{new Date(t.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="trip-fare">₹{t.cheapestPrice ?? '-'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <footer>
          <p>&copy; 2025 FairRide. All rights reserved. | Bringing transparency to ride-sharing</p>
        </footer>

        <div id="authModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="auth-title">Login</h2>
              <button className="close-btn">&times;</button>
            </div>
            <form id="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  style={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--tertiary-color)',
                    color: 'var(--text-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  style={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--tertiary-color)',
                    color: 'var(--text-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div id="signup-fields" style={{ display: 'none' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--tertiary-color)',
                      color: 'var(--text-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit phone number"
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--tertiary-color)',
                      color: 'var(--text-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--background-color)',
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
