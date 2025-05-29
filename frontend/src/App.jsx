// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from "./components/Login";
import Register from "./components/RegistrationPage";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components 2/AdminDashboard"; // Note the space in folder name

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Dashboard with nested routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;