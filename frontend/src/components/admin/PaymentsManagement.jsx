import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentsManagement = () => {
  const org_id = 1;
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [newPayment, setNewPayment] = useState({
    plot_id: '',
    resident_id: '',
    amount: '',
    payment_type: 'maintenance',
    payment_date: '',
    due_date: '',
    status: 'pending',
    payment_method: 'cash',
    transaction_id: '',
    notes: ''
  });

  const fetchResidents = async () => {
    const res = await axios.get(`/api/admin/residents/${org_id}`);
    setResidents(res.data);
  };

  const fetchPayments = async () => {
    const res = await axios.get(`/api/admin/payments/${org_id}`);
    setPayments(res.data);
  };

  const handleAddPayment = async () => {
    const selectedResident = residents.find(r => r.resident_id === Number(newPayment.resident_id));
    if (!selectedResident) return alert("Select a valid resident");

    await axios.post('/api/admin/payments', {
      ...newPayment,
      plot_id: selectedResident.plot_id
    });

    setNewPayment({
      plot_id: '',
      resident_id: '',
      amount: '',
      payment_type: 'maintenance',
      payment_date: '',
      due_date: '',
      status: 'pending',
      payment_method: 'cash',
      transaction_id: '',
      notes: ''
    });
    fetchPayments();
  };

  const handleDeletePayment = async (id) => {
    await axios.delete(`/api/admin/payments/${id}`);
    fetchPayments();
  };

  useEffect(() => {
    fetchResidents();
    fetchPayments();
  }, []);

  return (
    <div>
      <h3>Payment Management</h3>

      <div>
        <select
          value={newPayment.resident_id}
          onChange={(e) => setNewPayment({ ...newPayment, resident_id: e.target.value })}
        >
          <option value="">Select Resident</option>
          {residents.map((r) => (
            <option key={r.resident_id} value={r.resident_id}>
              {r.name} - Plot {r.plot_no} {r.flat_no && `Flat ${r.flat_no}`}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
        />
        <select
          value={newPayment.payment_type}
          onChange={(e) => setNewPayment({ ...newPayment, payment_type: e.target.value })}
        >
          <option value="maintenance">Maintenance</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>

        <input
          type="date"
          value={newPayment.payment_date}
          onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
        />
        <input
          type="date"
          value={newPayment.due_date}
          onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
        />
        <select
          value={newPayment.status}
          onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={newPayment.payment_method}
          onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}
        >
          <option value="cash">Cash</option>
          <option value="online">Online</option>
          <option value="cheque">Cheque</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
        <input
          placeholder="Transaction ID"
          value={newPayment.transaction_id}
          onChange={(e) => setNewPayment({ ...newPayment, transaction_id: e.target.value })}
        />
        <input
          placeholder="Notes"
          value={newPayment.notes}
          onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
        />
        <button onClick={handleAddPayment}>Add Payment</button>
      </div>

      <hr />

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Resident</th>
            <th>Plot</th>
            <th>Flat</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.resident_name}</td>
              <td>{p.plot_no}</td>
              <td>{p.flat_no || '-'}</td>
              <td>{p.payment_type}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
              <td>{p.payment_date?.slice(0, 10)}</td>
              <td>{p.payment_method}</td>
              <td><button onClick={() => handleDeletePayment(p.payment_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsManagement;
