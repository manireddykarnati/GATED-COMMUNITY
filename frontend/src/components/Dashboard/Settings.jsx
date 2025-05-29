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
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#2d3748", // gray-800 equivalent
          margin: 0,
        }}
      >
        Settings / Logout
      </h2>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#ef4444", // red-500 equivalent
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
