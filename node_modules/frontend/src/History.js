import React from 'react';
import { Link } from 'react-router-dom';

const History = () => {
  return (
    <div className="app-layout">
      {/* Main content */}
      <main className="main-content">
        <div className="history-container">
          <div className="history-header">
            <div>
              <h1>Trip History</h1>
              <p className="history-subtitle">View your recent rides and how much you saved with FairRide</p>
            </div>
            <button className="export-btn" onClick={() => alert('Export coming soon')}>
              ⬇ Export CSV
            </button>
          </div>

          <div className="history-filters">
            <select>
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>This year</option>
            </select>
            <select>
              <option>All providers</option>
              <option>Ola</option>
              <option>Uber</option>
              <option>Rapido</option>
            </select>
            <select>
              <option>All statuses</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>Scheduled</option>
            </select>
          </div>

          <div className="history-list">
            <div className="history-row header">
              <div>Route</div>
              <div>Date & time</div>
              <div>Provider / Fare</div>
              <div>Status</div>
            </div>

            <div className="history-row">
              <div>
                <div className="history-route">Greater Noida → Noida</div>
                <div className="history-meta">Distance: 18 km • 32 min</div>
              </div>
              <div>
                Dec 28, 6:30 PM
                <br />
                <span className="history-meta">Paid online</span>
              </div>
              <div>
                <div className="history-provider">
                  <span className="history-provider-badge">OLA</span>
                  <span>Mini</span>
                </div>
                <div className="history-fare">₹180</div>
              </div>
              <div>
                <span className="history-status">
                  <span className="status-dot"></span>
                  Completed
                </span>
              </div>
            </div>

            <div className="history-row">
              <div>
                <div className="history-route">Noida → New Delhi</div>
                <div className="history-meta">Distance: 24 km • 45 min</div>
              </div>
              <div>
                Dec 26, 9:10 AM
                <br />
                <span className="history-meta">Cash</span>
              </div>
              <div>
                <div className="history-provider">
                  <span className="history-provider-badge">UBER</span>
                  <span>Go</span>
                </div>
                <div className="history-fare">₹220</div>
              </div>
              <div>
                <span className="history-status">
                  <span className="status-dot"></span>
                  Completed
                </span>
              </div>
            </div>

            <div className="history-row">
              <div>
                <div className="history-route">Sector 62 → Airport</div>
                <div className="history-meta">Distance: 36 km • 55 min</div>
              </div>
              <div>
                Dec 25, 4:15 PM
                <br />
                <span className="history-meta">Refund processed</span>
              </div>
              <div>
                <div className="history-provider">
                  <span className="history-provider-badge">OLA</span>
                  <span>Prime Sedan</span>
                </div>
                <div className="history-fare">₹520</div>
              </div>
              <div>
                <span className="history-status">
                  <span className="status-dot cancelled"></span>
                  Cancelled
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>&copy; 2025 FairRide. All rights reserved. | Bringing transparency to ride-sharing</p>
        </footer>

        {/* Auth Modal (no buttons here, but modal kept same) */}
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

export default History;
