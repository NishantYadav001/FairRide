import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EMAIL } from './constants';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email !== ADMIN_EMAIL) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      {/* your existing admin UI (fare rules etc.) */}
      <div className="content">
        <h1>Admin Panel</h1>
        <div className="fare-rules-card">
          <h2>Fare Rules</h2>
          {/* ...rest of admin content... */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
