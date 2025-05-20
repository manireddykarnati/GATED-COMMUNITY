import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-xl font-bold mb-6">GCMS</div>
      <ul className="space-y-2 p-4">
        <li><Link to="/" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link></li>
        <li><Link to="/plot-info" className="block hover:bg-gray-700 p-2 rounded">My Plot/Flat Info</Link></li>
        <li><Link to="/payment-history" className="block hover:bg-gray-700 p-2 rounded">My Payment History</Link></li>
        <li><Link to="/notifications" className="block hover:bg-gray-700 p-2 rounded">Notifications</Link></li>
        <li><Link to="/profile" className="block hover:bg-gray-700 p-2 rounded">Profile</Link></li>
        <li><Link to="/settings" className="block hover:bg-gray-700 p-2 rounded">Settings / Logout</Link></li>
      </ul>
    </div>
  );
}
