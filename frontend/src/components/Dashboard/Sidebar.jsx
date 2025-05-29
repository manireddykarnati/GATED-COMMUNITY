import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">GCMS</div>
      <ul className="sidebar-nav">
        <li>
          <Link 
            to="/dashboard/" 
            className={location.pathname === "/dashboard/" ? "active" : ""}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard/plot" 
            className={location.pathname === "/dashboard/plot" ? "active" : ""}
          >
            My Plot/Flat Info
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard/payments" 
            className={location.pathname === "/dashboard/payments" ? "active" : ""}
          >
            My Payment History
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard/notifications" 
            className={location.pathname === "/dashboard/notifications" ? "active" : ""}
          >
            Notifications
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard/profile" 
            className={location.pathname === "/dashboard/profile" ? "active" : ""}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard/settings" 
            className={location.pathname === "/dashboard/settings" ? "active" : ""}
          >
            Settings / Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}