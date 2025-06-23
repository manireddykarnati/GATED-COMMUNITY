import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './css/userLayout.css';
import './css/theme.css';
import './css/globals.css';

const UserLayout = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="user-layout">
            <aside className="sidebar">
                <div>
                    <h3>GCMS Portal</h3>
                    <ul>
                        <li><Link to="/user-dashboard/">Home</Link></li>
                        <li><Link to="/user-dashboard/payments">Payments</Link></li>
                        <li><Link to="/user-dashboard/notifications">Notifications</Link></li>
                        <li><Link to="/user-dashboard/maintenance">Maintenance</Link></li>
                        <li><Link to="/user-dashboard/visitors">Visitor Logs</Link></li>
                    </ul>
                </div>
                <div>
                    <button className="theme-toggle" onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}>
                        Toggle Theme
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
