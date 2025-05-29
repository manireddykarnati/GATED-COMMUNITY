import React from "react";

export default function PaymentHistory() {
  return (
    <>
      <style>{`
        .payment-container {
          padding: 32px;
          width: 100%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
          max-width: 700px;
          margin: 0 auto;
        }

        .payment-container:hover {
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
        }

        .payment-title {
          font-size: 28px;
          font-weight: 800;
          color: #4f46e5;
          border-bottom: 4px solid #818cf8;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .payment-info p {
          font-size: 18px;
          color: #374151;
          margin-bottom: 12px;
        }

        .payment-info span {
          font-weight: 600;
          color: #4338ca;
        }

        .download-btn {
          background-color: #2563eb;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .download-btn:hover {
          background-color: #1e40af;
        }

        .outstanding {
          color: #dc2626;
          font-weight: bold;
          font-size: 18px;
          margin-top: 24px;
        }
      `}</style>

      <div className="payment-container">
        <h2 className="payment-title">My Payment History</h2>

        <div className="payment-info">
          <p><span>Date:</span> 2025-04-20</p>
          <p><span>Amount:</span> ₹3,000</p>
          <p><span>Mode:</span> UPI</p>
          <button className="download-btn">Download Receipt</button>
        </div>

        <p className="outstanding">Outstanding: ₹3,000</p>
      </div>
    </>
  );
}
