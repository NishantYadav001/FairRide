import React, { useState, useEffect } from 'react';

const API_BASE = (window.appConfig && window.appConfig.apiBase) || 'http://localhost:8080';

const Profile = () => {
  const storedEmail = localStorage.getItem('userEmail') || '';
  const storedName = localStorage.getItem('userName') || '';
  const storedPhone = localStorage.getItem('userPhone') || '';

  const [email] = useState(storedEmail);
  const [name, setName] = useState(storedName);
  const [phone, setPhone] = useState(storedPhone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load latest profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
      try {
        const res = await fetch(
          `${API_BASE}/api/auth/profile?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) {
          console.warn('Failed to load profile, status:', res.status);
          return;
        }
        const data = await res.json();
        const user = data.user || {};
        if (user.name) {
          setName(user.name);
          localStorage.setItem('userName', user.name);
        }
        if (user.phone) {
          setPhone(user.phone);
          localStorage.setItem('userPhone', user.phone);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (parseErr) {
          setMessage('Server returned invalid JSON.');
          console.error('JSON parse error', parseErr);
          setSaving(false);
          return;
        }
      } else {
        const text = await res.text();
        const msg = `Unexpected response from server (status ${res.status}).`;
        setMessage(msg + ' See console for server response.');
        console.error('Non-JSON response body:', text);
        setSaving(false);
        return;
      }

      if (!res.ok) {
        setMessage(data.error || `Could not update profile (status ${res.status}).`);
        setSaving(false);
        return;
      }

      const user = data.user || {};
      const newName = user.name || name;
      const newPhone = user.phone || phone;

      // Persist locally so UI updates across app
      localStorage.setItem('userName', newName);
      localStorage.setItem('userPhone', newPhone);
      setName(newName);
      setPhone(newPhone);

      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Profile update error', err);
      try {
        const pending = { email, name, phone, updatedAt: new Date().toISOString() };
        localStorage.setItem('userPendingProfile', JSON.stringify(pending));
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        setMessage(
          'Backend server is not responding. Your changes have been saved locally and will be synced when the server is back online.'
        );
      } catch (storeErr) {
        console.error('Failed to save profile locally', storeErr);
        setMessage('Failed to update profile. See console for details.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="profile-container">
          <h1>Profile Settings</h1>
          <p className="profile-subtitle">
            Manage your personal information and saved locations used across FairRide.
          </p>

          <div className="profile-card">
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-header">
                <div className="avatar">
                  <span>👤</span>
                </div>
                <div className="profile-info">
                  <h2>{name || 'User Name'}</h2>
                  <p>{email || 'user@example.com'} · {phone || '+91 99999 99999'}</p>
                  <button type="button" className="change-photo-btn">
                    Change photo (coming soon)
                  </button>
                </div>
              </div>

              <div>
                <div className="section-title">Basic details</div>
                <p className="section-helper">
                  These details are used on invoices and trip receipts.
                </p>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Email (login)</label>
                  <input type="email" value={email} readOnly />
                </div>
              </div>

              <div className="save-row">
                <p className="save-note">
                  {message || 'Changes are saved to the server and your browser.'}
                </p>
                <button className="save-changes-btn" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="danger-card">
            <h2>Danger zone</h2>
            <p>
              If you no longer want to use FairRide, you can request account deletion. This
              will remove your profile and trip history from future versions of the app.
            </p>
            <button
              className="danger-btn"
              type="button"
              onClick={() => alert('Account deletion flow coming soon.')}
            >
              Request account deletion
            </button>
          </div>
        </div>

        <footer>
          <p>
            &copy; 2025 FairRide. All rights reserved. | Bringing transparency to
            ride-sharing
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Profile;
