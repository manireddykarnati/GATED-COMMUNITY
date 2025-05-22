import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../Sidebar"; // correct relative path to Sidebar.js
import DashboardHome from "./DashboardHome";
import Notifications from "./Notifications";
import Payments from "./PaymentHistory";
import Plot from "./PlotInfo";
import Profile from "./Profile";
import Settings from "./Settings";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 ml-64"> {/* add margin-left to avoid sidebar overlap */}
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="plot" element={<Plot />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
