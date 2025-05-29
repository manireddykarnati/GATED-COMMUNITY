import React from "react";

export default function Notifications() {
  const notifications = [
    { id: 1, title: "Payment Received", description: "Your payment for May was successful.", date: "2025-05-20" },
    { id: 2, title: "New Message", description: "You have a new message from admin.", date: "2025-05-18" },
    { id: 3, title: "Maintenance Notice", description: "Scheduled maintenance on 2025-05-25.", date: "2025-05-15" },
  ];

  return (
    <>
      <style>{`
        .notifications-container {
          padding: 24px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 20px auto;
        }

        .notifications-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .notifications-empty {
          color: #6b7280;
        }

        .notifications-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .notification-item {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
          transition: background-color 0.2s ease;
        }

        .notification-item:hover {
          background-color: #f3f4f6;
        }

        .notification-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 6px 0;
        }

        .notification-description {
          color: #374151;
          margin: 0 0 6px 0;
        }

        .notification-date {
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>

      <div className="notifications-container">
        <h2 className="notifications-title">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="notifications-empty">No notifications to show.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map(({ id, title, description, date }) => (
              <li key={id} className="notification-item">
                <h3 className="notification-title">{title}</h3>
                <p className="notification-description">{description}</p>
                <span className="notification-date">{new Date(date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
