import React, { useState } from 'react';
import './AdminLogin.css';
import logo from '../../assets/logo.png'; // Adjust the path as per your project structure

const AdminLogin = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === 'manali' && pin === 'manali2006') {
      onLogin();
    } else {
      setError('Invalid name or PIN');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <img src={logo} alt="Admin Logo" className="admin-logo" />
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Enter Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
