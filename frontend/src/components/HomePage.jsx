import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const loginOptions = [
    {
      id: 'admin',
      title: 'Admin Login',
      description: 'Manage community operations, resident data, and system settings',
      icon: '🛡️',
      color: 'from-blue-600 to-purple-600',
      hoverColor: 'from-blue-700 to-purple-700',
      route: '/login'
    },
    {
      id: 'owner',
      title: 'Owner Login',
      description: 'Access property management, maintenance requests, and community updates',
      icon: '🏠',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
      route: '/login'
    },
    {
      id: 'tenant',
      title: 'Tenant Login',
      description: 'Submit requests, view announcements, and manage your tenancy',
      icon: '🔑',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'from-orange-600 to-red-600',
      route: '/login'
    }
  ];

  const handleLogin = (route) => {
    // Navigate to the login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className={`pt-8 pb-4 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 text-blue-400 flex items-center justify-center text-2xl">🏢</div>
                <div className="text-yellow-400 absolute -top-1 -right-1 animate-pulse text-sm">✨</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">gcms</h1>
                <p className="text-blue-200 text-sm font-medium">Gated Community Management system</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-6xl">
            {/* Welcome section */}
            <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x"> Digital Community</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Experience seamless community management with our comprehensive platform designed for modern gated communities
              </p>
            </div>

            {/* Login options */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {loginOptions.map((option, index) => {
                return (
                  <div
                    key={option.id}
                    className={`transform transition-all duration-700 delay-${(index + 1) * 200} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  >
                    <div
                      className={`group relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/15 ${hoveredCard === option.id ? 'shadow-2xl shadow-blue-500/25' : 'shadow-xl'}`}
                      onMouseEnter={() => setHoveredCard(option.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleLogin(option.route)}
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${hoveredCard === option.id ? option.hoverColor : option.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                      
                      {/* Icon */}
                      <div className={`relative mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${option.color} shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                        <div className="text-3xl">{option.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                          {option.title}
                        </h3>
                        <p className="text-slate-300 mb-6 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                          {option.description}
                        </p>
                        
                        {/* Action button */}
                        <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-all duration-300">
                          <span>Access Portal</span>
                          <div className={`ml-2 transform transition-transform duration-300 ${hoveredCard === option.id ? 'translate-x-1' : ''}`}>→</div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features highlight */}
            <div className={`mt-20 text-center transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse animation-delay-3000"></div>
                  <span>Mobile Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`py-8 text-center transform transition-all duration-1000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="container mx-auto px-6">
            <p className="text-slate-400 text-sm">
              © 2025 CommunityHub. Empowering communities through technology.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-400 {
          transition-delay: 400ms;
        }
        .delay-600 {
          transition-delay: 600ms;
        }
        .bg-grid-white\\/\\[0\\.02\\] {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;