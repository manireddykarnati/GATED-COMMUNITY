import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import PlotInfo from "./pages/PlotInfo";
import PaymentHistory from "./pages/PaymentHistory";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 p-6 bg-gray-50 min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plot-info" element={<PlotInfo />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
