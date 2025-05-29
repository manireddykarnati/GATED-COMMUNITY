import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      plotId: 1,
      flatId: null,
      amount: 5000,
      type: 'Maintenance',
      status: 'Paid',
      dueDate: '2025-06-01',
      paidDate: '2025-05-15',
    },
    {
      id: 2,
      plotId: 2,
      flatId: 1,
      amount: 3000,
      type: 'Maintenance',
      status: 'Pending',
      dueDate: '2025-06-01',
      paidDate: null,
    },
  ]);

  const [plots] = useState([
    { id: 1, number: 'P101', type: 'Individual' },
    { id: 2, number: 'P102', type: 'Flats', flats: [
      { id: 1, number: '101' },
      { id: 2, number: '102' },
    ]},
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [formData, setFormData] = useState({
    plotId: '',
    flatId: '',
    amount: '',
    type: 'Maintenance',
    dueDate: '',
    status: 'Pending',
  });

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        plotId: payment.plotId,
        flatId: payment.flatId,
        amount: payment.amount,
        type: payment.type,
        dueDate: payment.dueDate,
        status: payment.status,
      });
      setSelectedPlot(plots.find(p => p.id === payment.plotId));
    } else {
      setEditingPayment(null);
      setFormData({
        plotId: '',
        flatId: '',
        amount: '',
        type: 'Maintenance',
        dueDate: '',
        status: 'Pending',
      });
      setSelectedPlot(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
    setSelectedPlot(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'plotId') {
      setSelectedPlot(plots.find(p => p.id === value));
      setFormData(prev => ({ ...prev, flatId: '' }));
    }
  };

  const handleSubmit = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newPaymentData = {
      ...formData,
      paidDate: formData.status === 'Paid' ? currentDate : null,
    };

    if (editingPayment) {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === editingPayment.id
            ? { ...payment, ...newPaymentData }
            : payment
        )
      );
    } else {
      const newPayment = {
        id: payments.length + 1,
        ...newPaymentData,
      };
      setPayments((prev) => [...prev, newPayment]);
    }
    handleCloseDialog();
  };

  const handleDelete = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
    }
  };

  const handleSendReminder = (payment) => {
    // Implement payment reminder logic here
    alert(`Payment reminder sent for Plot ${getPaymentLocation(payment)}`);
  };

  const getPaymentLocation = (payment) => {
    const plot = plots.find(p => p.id === payment.plotId);
    if (!plot) return 'Unknown';
    
    if (plot.type === 'Individual') {
      return `Plot ${plot.number}`;
    } else {
      const flat = plot.flats.find(f => f.id === payment.flatId);
      return `Plot ${plot.number}, Flat ${flat?.number || 'Unknown'}`;
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Payments Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{getPaymentLocation(payment)}</TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.dueDate}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusChipColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.paidDate || '-'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(payment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(payment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {payment.status === 'Pending' && (
                    <IconButton
                      color="primary"
                      onClick={() => handleSendReminder(payment)}
                    >
                      <SendIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Plot</InputLabel>
            <Select
              name="plotId"
              value={formData.plotId}
              onChange={handleInputChange}
            >
              {plots.map((plot) => (
                <MenuItem key={plot.id} value={plot.id}>
                  Plot {plot.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedPlot?.type === 'Flats' && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Flat</InputLabel>
              <Select
                name="flatId"
                value={formData.flatId}
                onChange={handleInputChange}
              >
                {selectedPlot.flats.map((flat) => (
                  <MenuItem key={flat.id} value={flat.id}>
                    Flat {flat.number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Utility">Utility</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            value={formData.dueDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPayment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsManagement;
