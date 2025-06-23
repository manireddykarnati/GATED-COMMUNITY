import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const plotId = user?.plot_id;

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`/api/user/payments/${plotId}`);
            setPayments(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch payments", "error");
        }
    };

    const markAsPaid = async (id) => {
        try {
            await axios.put(`/api/user/payments/${id}/mark-paid`);
            Swal.fire("Success", "Payment marked as paid", "success");
            fetchPayments();
        } catch (err) {
            Swal.fire("Error", "Failed to update payment", "error");
        }
    };

    useEffect(() => {
        if (plotId) fetchPayments();
    }, [plotId]);

    return (
        <div>
            <h2>My Payments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Due</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.payment_id}>
                            <td>₹{payment.amount}</td>
                            <td>{payment.payment_type}</td>
                            <td>{payment.status}</td>
                            <td>{payment.payment_method}</td>
                            <td>{payment.payment_date?.substring(0, 10)}</td>
                            <td>{payment.due_date?.substring(0, 10) || '-'}</td>
                            <td>
                                {payment.status !== 'paid' && (
                                    <button onClick={() => markAsPaid(payment.payment_id)}>
                                        Mark as Paid
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payments;
