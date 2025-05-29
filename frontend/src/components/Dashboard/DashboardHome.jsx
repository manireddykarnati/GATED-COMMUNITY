import React from "react";

export default function DashboardHome() {
  return (
    <>
      <style>{`
        .dashboard-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 40px;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .dashboard-title {
          font-size: 36px;
          font-weight: 800;
          color: #4f46e5;
          border-bottom: 4px solid #818cf8;
          padding-bottom: 12px;
          margin-bottom: 40px;
        }

        .info-box {
          background: linear-gradient(to right, #dbeafe, #bfdbfe);
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.3s ease;
        }

        .info-box:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .info-text {
          font-size: 18px;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 8px;
        }

        .info-text span {
          font-weight: 500;
          color: #1e40af;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .card {
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .card-green {
          background: linear-gradient(to top right, #d1fae5, #bbf7d0);
          color: #065f46;
        }

        .card-red {
          background: linear-gradient(to top right, #fecaca, #fca5a5);
          color: #991b1b;
        }

        .card-label {
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .card-value {
          font-size: 26px;
          font-weight: 800;
        }

        .notification-box {
          background: linear-gradient(to right, #fef3c7, #fde68a);
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          color: #92400e;
        }

        .notification-box:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .notification-label {
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .notification-message {
          margin-top: 2px;
          font-size: 17px;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .dashboard-container {
            padding: 24px;
          }

          .dashboard-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to GCMS</h1>

        <div className="info-box">
          <p className="info-text">
            Street: <span>XYZ Street</span>
          </p>
          <p className="info-text">
            Plot: <span>101</span>
          </p>
          <p className="info-text">
            Ownership: <span>Owner</span>
          </p>
        </div>

        <div className="grid-container">
          <div className="card card-green">
            <p className="card-label">Last Payment</p>
            <p className="card-value">2025-04-20</p>
          </div>
          <div className="card card-red">
            <p className="card-label">Outstanding Amount</p>
            <p className="card-value">₹3,000</p>
          </div>
        </div>

        <div className="notification-box">
          <p className="notification-label">Recent Notification</p>
          <p className="notification-message">Maintenance due soon</p>
        </div>
      </div>
    </>
  );
}
