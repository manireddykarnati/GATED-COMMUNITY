import React from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear local storage/session or state if used
    // localStorage.removeItem("token");
    // Reset user context if you use one

    navigate("/"); // Navigate to login page
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Settings / Logout</h2>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
