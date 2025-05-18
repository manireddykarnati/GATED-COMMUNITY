import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    user_type: "",
    user_name: "",
    email: "",
    password: "",
    org_id: "",
    plot_id: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
      } else {
        setMessage(data.message || "Registration failed.");
        if (data.error) {
          console.error("Backend error:", data.error);
        }
      }
    } catch (error) {
      setMessage("Registration failed: Network error");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>

          <label>User Type</label>
          <input
            type="text"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            placeholder="owner, tenant, admin"
            required
          />

          <label>User Name</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Organisation ID</label>
          <input
            type="number"
            name="org_id"
            value={formData.org_id}
            onChange={handleChange}
            required
          />

          <label>Plot ID</label>
          <input
            type="number"
            name="plot_id"
            value={formData.plot_id}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
        {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
