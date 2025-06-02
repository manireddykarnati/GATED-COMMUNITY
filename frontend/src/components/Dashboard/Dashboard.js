// src/components/Dashboard/Dashboard.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

import DashboardHome from "./pages/DashboardHome";
import Notifications from "./pages/Notifications";
import PaymentHistory from "./pages/PaymentHistory";
import PlotInfo from "./pages/PlotInfo";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardHome />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="payment-history" element={<PaymentHistory />} />
        <Route path="plot-info" element={<PlotInfo />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
