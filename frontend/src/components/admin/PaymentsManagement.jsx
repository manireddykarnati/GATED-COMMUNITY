// src/components/admin/PaymentsManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const PaymentsManagement = () => {
  const org_id = 1;
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [plots, setPlots] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
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

  useEffect(() => {
    fetchPayments();
    fetchResidents();
    fetchPlots();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`/api/admin/payments/${org_id}`);
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`/api/admin/residents/${org_id}`);
      setResidents(res.data);
    } catch (err) {
      console.error('Error fetching residents:', err);
    }
  };

  const fetchPlots = async () => {
    try {
      const res = await axios.get(`/api/admin/plots/${org_id}`);
      setPlots(res.data);
    } catch (err) {
      console.error('Error fetching plots:', err);
    }
  };

  const handleOpen = () => {
    setForm({
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/admin/payments', form);
      fetchPayments();
      handleClose();
    } catch (err) {
      console.error('Error saving payment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    try {
      await axios.delete(`/api/admin/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
    }
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Payments</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Payment
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Resident</TableCell>
              <TableCell>Plot</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((pay, i) => (
              <TableRow key={pay.payment_id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{pay.resident_name}</TableCell>
                <TableCell>{pay.plot_no}</TableCell>
                <TableCell>₹{pay.amount}</TableCell>
                <TableCell>{pay.payment_type}</TableCell>
                <TableCell>{pay.status}</TableCell>
                <TableCell>{pay.payment_date}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(pay.payment_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Resident</InputLabel>
            <Select
              name="resident_id"
              value={form.resident_id}
              onChange={handleChange}
              label="Resident"
            >
              {residents.map((r) => (
                <MenuItem key={r.resident_id} value={r.resident_id}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Plot</InputLabel>
            <Select
              name="plot_id"
              value={form.plot_id}
              onChange={handleChange}
              label="Plot"
            >
              {plots.map((p) => (
                <MenuItem key={p.plot_id} value={p.plot_id}>
                  {p.plot_no}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField name="amount" label="Amount" fullWidth value={form.amount} onChange={handleChange} margin="dense" />
          <TextField name="payment_date" label="Payment Date" fullWidth type="date" value={form.payment_date} onChange={handleChange} margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField name="due_date" label="Due Date" fullWidth type="date" value={form.due_date} onChange={handleChange} margin="dense" InputLabelProps={{ shrink: true }} />

          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Payment Type</InputLabel>
            <Select name="payment_type" value={form.payment_type} onChange={handleChange}>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="water">Water</MenuItem>
              <MenuItem value="electricity">Electricity</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select name="payment_method" value={form.payment_method} onChange={handleChange}>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>

          <TextField name="transaction_id" label="Transaction ID" fullWidth value={form.transaction_id} onChange={handleChange} margin="dense" />
          <TextField name="notes" label="Notes" fullWidth value={form.notes} onChange={handleChange} margin="dense" />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Add</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default PaymentsManagement;
