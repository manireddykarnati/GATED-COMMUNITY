// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


function Login() {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/login', { user_name, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={user_name}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="message">{message}</p>

        {/* Register link */}
        <p className="register-footer">
          Don't have an account?{' '}
          <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;