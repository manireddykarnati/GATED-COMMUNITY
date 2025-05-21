import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./src/components/Sidebar";
import DashboardPage from "./src/pages/Dashboard"; // or whatever page names you have
import Notification from "./src/pages/Notifications";
import Payments from "./src/pages/PaymentHistory";
import Plot from "./src/pages/PlotInfo";
import Profile from "./src/pages/Profile";
import Setting from "./src/pages/Settings";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="payments" element={<Payments />} />
          <Route path="plot" element={<Plot />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Setting />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
