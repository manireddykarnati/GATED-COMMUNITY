import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from './components/HomePage';
import Login from "./components/Login";
import Register from "./components/RegistrationPage";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components 2/AdminDashboard"; // We'll fix this path later

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
