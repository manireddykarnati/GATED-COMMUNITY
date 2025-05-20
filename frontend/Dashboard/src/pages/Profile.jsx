import { useState } from "react";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  const profile = {
    name: "Kavin Mugilan S",
    email: "kavin@example.com",
    contact: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?img=12", // You can replace with local or uploaded image
  };

  return (
    <div className="p-8 w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-6">
      <h2 className="text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-2">
        My Profile
      </h2>

      <div className="flex items-center space-x-6">
        <img
          src={profile.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full shadow-md border-4 border-indigo-300"
        />
        <div className="space-y-2 text-lg text-gray-700">
          {editMode ? (
            <>
              <input
                type="text"
                defaultValue={profile.name}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                defaultValue={profile.email}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                defaultValue={profile.contact}
                className="w-full p-2 border rounded"
              />
              <input type="file" className="w-full p-2 border rounded" />
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold text-indigo-800">Name:</span> {profile.name}
              </p>
              <p>
                <span className="font-semibold text-indigo-800">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold text-indigo-800">Contact:</span> {profile.contact}
              </p>
              <p>
                <span className="font-semibold text-indigo-800">Profile Picture:</span> Uploaded
              </p>
            </>
          )}
        </div>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Save Profile" : "Edit Profile"}
      </button>
    </div>
  );
}
