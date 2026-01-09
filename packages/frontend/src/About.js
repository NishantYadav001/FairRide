import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="about-container">
          <div className="about-header">
            <h1 className="about-title">About FairRide</h1>
            <p className="about-subtitle">
              FairRide helps you see cab fares from multiple platforms side by side so you always know you are getting a
              fair price.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h2>Why we built FairRide</h2>
              <p>
                Most riders switch between multiple apps to check fares, estimated times, and surge pricing before
                booking a ride. FairRide brings that comparison into one clean interface so you can decide in seconds
                instead of minutes.
              </p>
              <ul className="about-list">
                <li>Compare estimated fares from different providers on a single screen.</li>
                <li>See availability and typical arrival times for each option.</li>
                <li>Make more informed choices and avoid overpaying during surge hours.</li>
              </ul>
            </div>

            <div className="about-card">
              <h2>What you see today</h2>
              <p>
                The current version is a prototype focused on core comparison flows for riders in India. Live
                integrations with providers will be added in later versions.
              </p>
              <div className="pill-row">
                <span className="pill">Cab fare comparison</span>
                <span className="pill">Sample trips &amp; savings</span>
                <span className="pill">Dark theme UI</span>
                <span className="pill">Responsive layout</span>
              </div>
            </div>

            <div className="about-card">
              <h2>What is coming next</h2>
              <p>
                The roadmap includes deeper integrations and personalization so that FairRide can adapt to your daily
                travel patterns.
              </p>
              <ul className="about-list">
                <li>Real‑time fare estimates from multiple providers.</li>
                <li>Trip history synced across devices.</li>
                <li>Smart suggestions based on time of day and usual routes.</li>
              </ul>
            </div>

            <div className="about-card">
              <h2>Contact & feedback</h2>
              <p>
                Feedback makes the product better. If something feels confusing, slow, or missing, please share it.
              </p>
              <div className="contact-row">
                Email: <a href="mailto:feedback@fairride.app">feedback@fairride.app</a>
                <br />
                Twitter: <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                  @fairride
                </a>
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

export default About;
