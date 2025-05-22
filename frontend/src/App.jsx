// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/RegistrationPage";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page is the default route */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard Page */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
