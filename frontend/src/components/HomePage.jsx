import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    { icon: '🔒', text: 'Bank-Grade Security', color: 'blue' },
    { icon: '📱', text: 'Mobile First Design', color: 'green' },
    { icon: '⚡', text: 'Lightning Fast', color: 'purple' },
    { icon: '🌐', text: '24/7 Availability', color: 'orange' },
    { icon: '🤖', text: 'AI-Powered Insights', color: 'cyan' },
    { icon: '☁️', text: 'Cloud Infrastructure', color: 'indigo' }
  ];

  useEffect(() => {
    // Trigger loading animation
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Feature rotation
    const featureTimer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(featureTimer);
    };
  }, [features.length]);

  const handleLogin = () => {
    navigate('/login');
  };

  const stats = [
    { number: '99.9%', label: 'Uptime', icon: '📈' },
    { number: '500+', label: 'Communities', icon: '🏘️' },
    { number: '50K+', label: 'Happy Users', icon: '👥' },
    { number: '24/7', label: 'Support', icon: '🛟' }
  ];

  return (
    <div className={`homepage-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Animated background elements */}
      <div className="background-effects">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-overlay"></div>

      <div className="homepage-content">
        {/* Header */}
        <header className={`homepage-header ${isLoaded ? 'animate-in' : ''}`}>
          <div className="header-container">
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-icon">🏠</div>
                <div className="logo-sparkle">✨</div>
              </div>
              <div className="brand-info">
                <h1 className="brand-title">GCMS</h1>
                <p className="brand-subtitle">Gated Community Management System</p>
              </div>
            </div>
            <button className="header-login-btn" onClick={handleLogin}>
              <span>Login</span>
              <div className="btn-arrow">→</div>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="homepage-main">
          <div className="main-container">
            {/* Welcome section */}
            <div className={`hero-section ${isLoaded ? 'animate-in delay-300' : ''}`}>
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="badge-icon">🚀</span>
                  <span>Next Generation Community Platform</span>
                </div>
                <h1 className="hero-title">
                  Transform Your
                  <span className="gradient-text"> Community Experience</span>
                </h1>
                <p className="hero-description">
                  Discover the future of gated community management with our comprehensive,
                  intelligent platform designed for modern living. Seamlessly connect, manage,
                  and thrive in your digital community ecosystem.
                </p>

                {/* Primary CTA */}
                <div className="hero-actions">
                  <button
                    className={`primary-cta ${hoveredCard === 'login' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredCard('login')}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={handleLogin}
                  >
                    <div className="cta-content">
                      <div className="cta-icon">🔐</div>
                      <div className="cta-text">
                        <span className="cta-title">Access Your Portal</span>
                        <span className="cta-subtitle">Secure community dashboard</span>
                      </div>
                      <div className="cta-arrow">→</div>
                    </div>
                  </button>
                </div>

                {/* Rotating Features */}
                <div className="rotating-features">
                  <div className="feature-indicator">
                    <div className={`feature-item active`}>
                      <span className="feature-icon">{features[currentFeature].icon}</span>
                      <span className="feature-text">{features[currentFeature].text}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className={`stats-section ${isLoaded ? 'animate-in delay-600' : ''}`}>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className={`stat-card delay-${(index + 1) * 100}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features highlight */}
            <div className={`features-showcase ${isLoaded ? 'animate-in delay-900' : ''}`}>
              <h2 className="features-title">Why Choose GCMS?</h2>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className={`feature-card delay-${index * 100}`}>
                    <div className={`feature-icon-wrapper ${feature.color}`}>
                      <span className="feature-icon-large">{feature.icon}</span>
                    </div>
                    <h3 className="feature-title">{feature.text}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`trust-section ${isLoaded ? 'animate-in delay-1200' : ''}`}>
              <div className="trust-content">
                <h3 className="trust-title">Trusted by Communities Worldwide</h3>
                <div className="trust-badges">
                  <div className="trust-badge">
                    <span className="trust-icon">🛡️</span>
                    <span>ISO 27001 Certified</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">🔒</span>
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">⭐</span>
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">🏆</span>
                    <span>Award Winning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`homepage-footer ${isLoaded ? 'animate-in delay-1500' : ''}`}>
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-main">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <span className="footer-logo-icon">🏠</span>
                    <span className="footer-logo-text">GCMS</span>
                  </div>
                  <p className="footer-tagline">
                    Empowering communities through innovative technology solutions.
                  </p>
                </div>

                <div className="footer-links">
                  <div className="footer-column">
                    <h4>Platform</h4>
                    <button className="footer-link">Features</button>
                    <button className="footer-link">Security</button>
                    <button className="footer-link">Integrations</button>
                  </div>
                  <div className="footer-column">
                    <h4>Support</h4>
                    <button className="footer-link">Help Center</button>
                    <button className="footer-link">Documentation</button>
                    <button className="footer-link">Contact Us</button>
                  </div>
                  <div className="footer-column">
                    <h4>Company</h4>
                    <button className="footer-link">About</button>
                    <button className="footer-link">Privacy</button>
                    <button className="footer-link">Terms</button>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p className="footer-copyright">
                  © 2025 GCMS. All rights reserved. Built with ❤️ for communities.
                </p>
                <div className="footer-social">
                  <button className="social-link" aria-label="Twitter">🐦</button>
                  <button className="social-link" aria-label="LinkedIn">💼</button>
                  <button className="social-link" aria-label="GitHub">🔗</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;