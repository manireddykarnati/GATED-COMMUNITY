// src/components/admin/ReportsAnalytics.jsx
import React, { useEffect, useState } from 'react';
import {
    Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper
} from '@mui/material';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const ReportsAnalytics = () => {
    const org_id = 1;
    const [paymentSummary, setPaymentSummary] = useState([]);
    const [residentCount, setResidentCount] = useState([]);
    const [overduePayments, setOverduePayments] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [summaryRes, countRes, overdueRes] = await Promise.all([
                axios.get(`/api/admin/reports/payment-summary/${org_id}`),
                axios.get(`/api/admin/reports/resident-count/${org_id}`),
                axios.get(`/api/admin/reports/overdue-payments/${org_id}`)
            ]);

            setPaymentSummary(summaryRes.data);
            setResidentCount(countRes.data);
            setOverduePayments(overdueRes.data);
        } catch (err) {
            console.error('Error fetching reports:', err);
        }
    };

    return (
        <PageWrapper>
            <Typography variant="h5" gutterBottom>
                Reports & Analytics
            </Typography>

            {/* Payment Summary */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Payment Summary</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Count</TableCell>
                            <TableCell align="right">Total Amount (₹)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentSummary.map((row) => (
                            <TableRow key={row.status}>
                                <TableCell>{row.status}</TableCell>
                                <TableCell align="right">{row.count}</TableCell>
                                <TableCell align="right">{parseFloat(row.total).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Resident Count */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Residents by Street</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Street</TableCell>
                            <TableCell align="right">No. of Residents</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {residentCount.map((row) => (
                            <TableRow key={row.street_name}>
                                <TableCell>{row.street_name}</TableCell>
                                <TableCell align="right">{row.resident_count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Overdue Payments */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Overdue Payments</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Resident</TableCell>
                            <TableCell>Plot</TableCell>
                            <TableCell>Flat</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {overduePayments.map((p) => (
                            <TableRow key={p.payment_id}>
                                <TableCell>{p.resident_name}</TableCell>
                                <TableCell>{p.plot_no}</TableCell>
                                <TableCell>{p.flat_no || '-'}</TableCell>
                                <TableCell>₹{parseFloat(p.amount).toFixed(2)}</TableCell>
                                <TableCell>{p.due_date}</TableCell>
                                <TableCell>{p.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </PageWrapper>
    );
};

export default ReportsAnalytics;
