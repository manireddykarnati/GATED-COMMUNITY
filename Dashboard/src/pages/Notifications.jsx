export default function Notifications() {
  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
      <div className="bg-yellow-100 p-4 rounded-lg shadow text-yellow-900">
        <p>⚠️ Maintenance due on 2025-05-25</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg shadow text-green-900">
        <p>✅ Payment received for April</p>
      </div>
    </div>
  );
}
