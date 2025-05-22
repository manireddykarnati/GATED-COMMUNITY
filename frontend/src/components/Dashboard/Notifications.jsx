import React from "react";

export default function Notifications() {
  // Sample notifications data - you can replace with actual fetched data later
  const notifications = [
    { id: 1, title: "Payment Received", description: "Your payment for May was successful.", date: "2025-05-20" },
    { id: 2, title: "New Message", description: "You have a new message from admin.", date: "2025-05-18" },
    { id: 3, title: "Maintenance Notice", description: "Scheduled maintenance on 2025-05-25.", date: "2025-05-15" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications to show.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map(({ id, title, description, date }) => (
            <li
              key={id}
              className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-700">{description}</p>
              <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
