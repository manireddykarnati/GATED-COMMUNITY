import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  // Validation effects
  useEffect(() => {
    setIsUsernameValid(user_name.length >= 3);
  }, [user_name]);

  useEffect(() => {
    setIsPasswordValid(password.length >= 6);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5001/api/login', {
        user_name,
        password
      });

      console.log("Login Response:", res.data);

      if (res.data.success) {
        const userData = res.data.user;

        // Store user data in sessionStorage for access across components
        sessionStorage.setItem('userData', JSON.stringify(userData));

        // Set success message
        setMessage(res.data.welcomeMessage || 'Login successful!');

        // Small delay for better UX and to show success message
        setTimeout(() => {
          // Redirect based on user type
          if (userData.user_type === 'admin') {
            console.log("Redirecting to admin dashboard...");
            navigate('/admin-dashboard');
          } else {
            console.log("Redirecting to user dashboard...");
            navigate('/dashboard');
          }
        }, 1200); // Increased delay to show success message
      } else {
        setMessage(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setMessage(errorMessage);
    } finally {
      // Ensure loading state shows for at least 800ms for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Shapes */}
      <div className="bg-shape"></div>
      <div className="bg-shape"></div>
      <div className="bg-shape"></div>

      {/* Header Section - Matching Homepage */}
      <div className="login-header">
        <div className="logo-section">
          <div className="logo-icon"></div>
          <div className="brand-text">GCMS</div>
        </div>
        <div className="brand-subtitle">Gated Community Management System</div>
      </div>

      {/* Login Form */}
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="welcome-subtitle">Sign in to access your community portal</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="username"
              aria-describedby="username-help"
            />
            {isUsernameValid && (
              <span className="input-validation" role="img" aria-label="Valid">✓</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby="password-help"
            />
            {isPasswordValid && (
              <span className="input-validation" role="img" aria-label="Valid">✓</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isUsernameValid || !isPasswordValid}
            className={isLoading ? 'loading' : ''}
            aria-describedby="submit-help"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div
            className={`message ${message.includes('success') ||
                message.includes('Welcome') ||
                message.toLowerCase().includes('login successful') ||
                message.includes('successful')
                ? 'success'
                : 'error'
              }`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <p className="register-footer">
          Don&apos;t have an account? <a href="/register">Create one here</a>
        </p>

        {/* Security Badge */}
        <div className="security-badge" title="Secure Login">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Login;