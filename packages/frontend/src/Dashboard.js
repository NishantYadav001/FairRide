import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, User!</h1>
            <Link to="/" className="new-comparison-btn">
              New Comparison
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-value">₹2,450</div>
              <div className="stat-card-label">Total Saved</div>
              <div className="stat-card-sublabel">This month</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">12</div>
              <div className="stat-card-label">Trips Taken</div>
              <div className="stat-card-sublabel">Last 30 days</div>
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
              <div className="trip-item">
                <div className="provider-logo ola-logo">OLA</div>
                <div className="trip-details">
                  <div className="trip-route">Greater Noida → Noida</div>
                  <div className="trip-timestamp">Dec 28, 6:30 PM</div>
                </div>
                <div className="trip-fare">₹180</div>
              </div>
              <div className="trip-item">
                <div className="provider-logo uber-logo">UBER</div>
                <div className="trip-details">
                  <div className="trip-route">Noida → New Delhi</div>
                  <div className="trip-timestamp">Dec 26, 9:10 AM</div>
                </div>
                <div className="trip-fare">₹220</div>
              </div>
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
