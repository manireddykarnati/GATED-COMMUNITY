import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsAnalytics = () => {
    const org_id = 1;
    const [paymentSummary, setPaymentSummary] = useState([]);
    const [residentStats, setResidentStats] = useState([]);
    const [overduePayments, setOverduePayments] = useState([]);

    useEffect(() => {
        axios.get(`/api/admin/reports/payment-summary/${org_id}`).then(res => setPaymentSummary(res.data));
        axios.get(`/api/admin/reports/resident-count/${org_id}`).then(res => setResidentStats(res.data));
        axios.get(`/api/admin/reports/overdue-payments/${org_id}`).then(res => setOverduePayments(res.data));
    }, []);

    return (
        <div>
            <h3>Reports & Analytics</h3>

            <section>
                <h4>Payment Summary</h4>
                <ul>
                    {paymentSummary.map((item, i) => (
                        <li key={i}>
                            Status: <strong>{item.status}</strong> — Count: {item.count} — Total ₹{item.total}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h4>Resident Count by Street</h4>
                <ul>
                    {residentStats.map((s, i) => (
                        <li key={i}>{s.street_name}: {s.resident_count} residents</li>
                    ))}
                </ul>
            </section>

            <section>
                <h4>Overdue Payments</h4>
                {overduePayments.length === 0 && <p>No overdue payments 🎉</p>}
                {overduePayments.length > 0 && (
                    <table border="1" cellPadding="5">
                        <thead>
                            <tr>
                                <th>Resident</th>
                                <th>Plot</th>
                                <th>Flat</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overduePayments.map(p => (
                                <tr key={p.payment_id}>
                                    <td>{p.resident_name}</td>
                                    <td>{p.plot_no}</td>
                                    <td>{p.flat_no || '-'}</td>
                                    <td>₹{p.amount}</td>
                                    <td>{p.due_date?.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default ReportsAnalytics;
