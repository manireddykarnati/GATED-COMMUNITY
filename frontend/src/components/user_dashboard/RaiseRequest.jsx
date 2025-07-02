import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./RaiseRequest.css";

const RaiseRequest = ({ plot_id, user_id, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        priority: "normal",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/user/maintenance", {
                plot_id,
                resident_id: user_id,
                ...formData,
            });
            Swal.fire("Success", "Request raised successfully", "success");
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to submit request", "error");
        }
    };

    return (
        <div className="raise-request-container">
            <h2 className="form-title">Raise New Maintenance Request</h2>
            <form className="raise-request-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="General">General</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Security">Security</option>
                </select>
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Submit</button>
                    <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default RaiseRequest;
