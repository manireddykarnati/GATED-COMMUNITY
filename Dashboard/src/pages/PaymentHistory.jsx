export default function PaymentHistory() {
  return (
    <div className="p-8 w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-6">
      <h2 className="text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-2">
        My Payment History
      </h2>

      <div className="space-y-3">
        <p className="text-gray-700 text-lg">
          <span className="font-semibold text-indigo-800">Date:</span> 2025-04-20
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-semibold text-indigo-800">Amount:</span> ₹3,000
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-semibold text-indigo-800">Mode:</span> UPI
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Download Receipt
        </button>
      </div>

      <p className="text-red-600 font-bold text-lg">
        Outstanding: ₹3,000
      </p>
    </div>
  );
}
