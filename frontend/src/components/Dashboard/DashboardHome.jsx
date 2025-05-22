import React from "react";

export default function DashboardHome() {
  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg w-full">
      <h1 className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-3 mb-6">
        Welcome to GCMS
      </h1>

      <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <p className="text-lg font-semibold text-blue-900 mb-2">
          Street: <span className="font-normal text-blue-800">XYZ Street</span>
        </p>
        <p className="text-lg font-semibold text-blue-900 mb-2">
          Plot: <span className="font-normal text-blue-800">101</span>
        </p>
        <p className="text-lg font-semibold text-blue-900">
          Ownership: <span className="font-normal text-blue-800">Owner</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-tr from-green-100 to-green-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-green-900">
          <p className="text-sm uppercase tracking-wide font-semibold">Last Payment</p>
          <p className="text-2xl font-extrabold mt-1">2025-04-20</p>
        </div>
        <div className="bg-gradient-to-tr from-red-100 to-red-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-red-900">
          <p className="text-sm uppercase tracking-wide font-semibold">Outstanding Amount</p>
          <p className="text-2xl font-extrabold mt-1">₹3,000</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-yellow-900">
        <p className="text-sm uppercase tracking-wide font-semibold">Recent Notification</p>
        <p className="font-medium mt-1">Maintenance due soon</p>
      </div>
    </div>
  );
}
