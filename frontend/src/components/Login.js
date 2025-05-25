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
      
      setMessage(res.data.message);
      console.log("Response:", res.data);
      
      if (res.data.success) {
        // Small delay for better UX and loading animation
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      // Ensure loading state shows for at least 500ms for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="login-container">
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
            {isLoading ? 'Authenticating' : 'Sign In'}
          </button>
        </form>
        
        {message && (
          <div 
            className={`message ${
              message.includes('success') || 
              message.includes('Welcome') || 
              message.toLowerCase().includes('login successful') 
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Login;