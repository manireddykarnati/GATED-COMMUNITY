import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const loginOptions = [
    {
      id: 'admin',
      title: 'Admin Login',
      description: 'Manage community operations, resident data, and system settings',
      icon: '🛡️',
      color: 'admin',
      route: '/login'
    },
    {
      id: 'owner',
      title: 'Owner Login',
      description: 'Access property management, maintenance requests, and community updates',
      icon: '🏠',
      color: 'owner',
      route: '/login'
    },
    {
      id: 'tenant',
      title: 'Tenant Login',
      description: 'Submit requests, view announcements, and manage your tenancy',
      icon: '🔑',
      color: 'tenant',
      route: '/login'
    }
  ];

  const handleLogin = (route) => {
    navigate(route);
  };

  return (
    <div className={`homepage-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Animated background elements */}
      <div className="background-effects">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-overlay"></div>

      <div className="homepage-content">
        {/* Header */}
        <header className={`homepage-header ${isLoaded ? 'animate-in' : ''}`}>
          <div className="header-container">
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-icon">🏢</div>
                <div className="logo-sparkle">✨</div>
              </div>
              <div className="brand-info">
                <h1 className="brand-title">GCMS</h1>
                <p className="brand-subtitle">Gated Community Management System</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="homepage-main">
          <div className="main-container">
            {/* Welcome section */}
            <div className={`welcome-section ${isLoaded ? 'animate-in delay-300' : ''}`}>
              <h2 className="welcome-title">
                Welcome to Your
                <span className="gradient-text"> Digital Community</span>
              </h2>
              <p className="welcome-description">
                Experience seamless community management with our comprehensive platform designed for modern gated communities
              </p>
            </div>

            {/* Login options */}
            <div className="login-options">
              {loginOptions.map((option, index) => {
                return (
                  <div
                    key={option.id}
                    className={`login-card ${isLoaded ? 'animate-in' : ''} delay-${(index + 1) * 200} ${hoveredCard === option.id ? 'hovered' : ''}`}
                  >
                    <div
                      className={`card-content ${option.color}-card`}
                      onMouseEnter={() => setHoveredCard(option.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleLogin(option.route)}
                    >
                      {/* Icon */}
                      <div className={`card-icon ${option.color}-icon`}>
                        <div className="icon-text">{option.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="card-info">
                        <h3 className="card-title">{option.title}</h3>
                        <p className="card-description">{option.description}</p>
                        
                        {/* Action button */}
                        <div className="card-action">
                          <span>Access Portal</span>
                          <div className="action-arrow">→</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features highlight */}
            <div className={`features-section ${isLoaded ? 'animate-in delay-1000' : ''}`}>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-dot blue-dot"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot green-dot"></div>
                  <span>Secure Platform</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot purple-dot"></div>
                  <span>Real-time Updates</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot orange-dot"></div>
                  <span>Mobile Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`homepage-footer ${isLoaded ? 'animate-in delay-1200' : ''}`}>
          <div className="footer-container">
            <p className="footer-text">
              © 2025 GCMS. Empowering communities through technology.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;