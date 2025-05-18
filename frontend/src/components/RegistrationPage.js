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

    setMessage(""); // reset message

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

          <div className="form-group">
            <label className="register-label">User Type</label>
            <input
              type="text"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="register-input"
              placeholder="owner, tenant, or admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="register-label">User Name</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="register-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="register-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="register-label">Organisation ID</label>
            <input
              type="number"
              name="org_id"
              value={formData.org_id}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="register-label">Plot ID</label>
            <input
              type="number"
              name="plot_id"
              value={formData.plot_id}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "red", textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
