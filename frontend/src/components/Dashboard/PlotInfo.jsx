import React from "react";

export default function PlotInfo() {
  return (
    <>
      <style>{`
        .plot-container {
          padding: 32px;
          width: 100%;
          background: linear-gradient(to right, #eff6ff, #e0e7ff);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
          margin: 0 auto;
          max-width: 700px;
        }

        .plot-container:hover {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
        }

        .plot-title {
          font-size: 28px;
          font-weight: 800;
          color: #4f46e5;
          border-bottom: 4px solid #818cf8;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .plot-info p {
          font-size: 18px;
          color: #374151;
          margin-bottom: 12px;
          transition: color 0.3s ease;
          cursor: default;
        }

        .plot-info p:hover {
          color: #4f46e5;
        }

        .plot-info span {
          font-weight: 600;
          color: #4338ca;
        }
      `}</style>

      <div className="plot-container">
        <h2 className="plot-title">My Plot / Flat Info</h2>
        <div className="plot-info">
          <p><span>Street:</span> XYZ Street</p>
          <p><span>Plot Number:</span> 101</p>
          <p><span>Flat Number:</span> A-203</p>
          <p><span>Ownership Type:</span> Owner</p>
          <p><span>Co-residents:</span> 3</p>
        </div>
      </div>
    </>
  );
}
