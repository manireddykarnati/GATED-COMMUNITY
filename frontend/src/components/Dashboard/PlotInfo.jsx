import React from "react";
export default function PlotInfo() {
  return (
    <div className="p-8 w-full bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 space-y-6">
      <h2 className="text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-2">
        My Plot / Flat Info
      </h2>
      <div className="space-y-3">
        <p className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 cursor-default">
          <span className="font-semibold text-indigo-800">Street:</span> XYZ Street
        </p>
        <p className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 cursor-default">
          <span className="font-semibold text-indigo-800">Plot Number:</span> 101
        </p>
        <p className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 cursor-default">
          <span className="font-semibold text-indigo-800">Flat Number:</span> A-203
        </p>
        <p className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 cursor-default">
          <span className="font-semibold text-indigo-800">Ownership Type:</span> Owner
        </p>
        <p className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 cursor-default">
          <span className="font-semibold text-indigo-800">Co-residents:</span> 3
        </p>
      </div>
    </div>
  );
}