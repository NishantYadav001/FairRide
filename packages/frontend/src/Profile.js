import React from 'react';

const Profile = () => {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="profile-container">
          <h1>Profile Settings</h1>
          <p className="profile-subtitle">
            Manage your personal information and saved locations used across FairRide.
          </p>

          <div className="profile-card">
            <form
              className="profile-form"
              onSubmit={(event) => {
                event.preventDefault();
                alert('Changes saved (demo).');
              }}
            >
              <div className="profile-header">
                <div className="avatar">
                  <span>👤</span>
                </div>
                <div className="profile-info">
                  <h2>User Name</h2>
                  <p>user@example.com · +91 99999 99999</p>
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
                  <input type="text" defaultValue="User Name" />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Phone</label>
                  <input type="tel" defaultValue="+91 99999 99999" />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Email (login)</label>
                  <input type="email" defaultValue="user@example.com" readOnly />
                </div>
              </div>

              <div>
                <div className="section-title" style={{ marginTop: '8px' }}>
                  Saved addresses
                </div>
                <p className="section-helper">
                  Quickly select Home and Work while searching for rides.
                </p>
                <div className="address-fields">
                  <div className="form-group">
                    <label>Home address</label>
                    <input type="text" placeholder="Add home address" />
                  </div>
                  <div className="form-group">
                    <label>Work address</label>
                    <input type="text" placeholder="Add work address" />
                  </div>
                </div>
              </div>

              <div className="save-row">
                <p className="save-note">
                  Changes are only saved for this demo in your current browser session.
                </p>
                <button className="save-changes-btn" type="submit">
                  Save changes
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
