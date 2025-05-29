import React, { useState } from "react";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  const profile = {
    name: "Kavin Mugilan S",
    email: "kavin@example.com",
    contact: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <>
      <style>{`
        .profile-container {
          padding: 32px;
          width: 100%;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
          margin: 0 auto;
          max-width: 700px;
        }

        .profile-container:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .profile-title {
          font-size: 28px;
          font-weight: 800;
          color: #4f46e5;
          border-bottom: 4px solid #818cf8;
          padding-bottom: 10px;
          margin-bottom: 24px;
        }

        .profile-flex {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 4px solid #a5b4fc;
          box-shadow: 0 0 6px rgba(0,0,0,0.1);
        }

        .profile-info {
          font-size: 16px;
          color: #374151;
          flex-grow: 1;
        }

        .profile-info p {
          margin-bottom: 12px;
        }

        .profile-info span {
          font-weight: 600;
          color: #4338ca;
        }

        .profile-input {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
        }

        .profile-button {
          background-color: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }

        .profile-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>

      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-flex">
          <img
            src={profile.avatar}
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-info">
            {editMode ? (
              <>
                <input
                  type="text"
                  defaultValue={profile.name}
                  className="profile-input"
                />
                <input
                  type="email"
                  defaultValue={profile.email}
                  className="profile-input"
                />
                <input
                  type="text"
                  defaultValue={profile.contact}
                  className="profile-input"
                />
                <input type="file" className="profile-input" />
              </>
            ) : (
              <>
                <p><span>Name:</span> {profile.name}</p>
                <p><span>Email:</span> {profile.email}</p>
                <p><span>Contact:</span> {profile.contact}</p>
                <p><span>Profile Picture:</span> Uploaded</p>
              </>
            )}
          </div>
        </div>

        <button
          className="profile-button"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Profile" : "Edit Profile"}
        </button>
      </div>
    </>
  );
}
