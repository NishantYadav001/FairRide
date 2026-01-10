import React, { useState, useEffect } from 'react';

const API_BASE = (window.appConfig && window.appConfig.apiBase) || 'http://localhost:8080';

const Profile = () => {
  const storedEmail = localStorage.getItem('userEmail') || '';
  const storedName = localStorage.getItem('userName') || '';

  const [email] = useState(storedEmail);
  const [name, setName] = useState(storedName);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Optionally fetch latest profile from backend here
  }, []);

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
        // Non-JSON response (likely HTML) — capture text for debugging
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

      // Persist locally so UI updates across app
      localStorage.setItem('userName', data.user?.name || name);
      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Profile update error', err);
      // Backend unreachable — persist changes locally so user doesn't lose edits.
      try {
        const pending = { email, name, phone, updatedAt: new Date().toISOString() };
        localStorage.setItem('userPendingProfile', JSON.stringify(pending));
        localStorage.setItem('userName', name);
        // Keep email as source of truth for login
        setMessage('Could not reach server — changes saved locally and will sync when backend is available.');
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
                  <p>{email || 'user@example.com'} · +91 99999 99999</p>
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
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Email (login)</label>
                  <input type="email" value={email} readOnly />
                </div>
              </div>

              <div className="save-row">
                <p className="save-note">{message || 'Changes are saved to the server and your browser.'}</p>
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
