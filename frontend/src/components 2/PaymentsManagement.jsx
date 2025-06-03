import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  TablePagination,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Payment as PaymentIcon,
  MonetizationOn,
  PendingActions,
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PaymentsManagement = ({ userData }) => {
  const [payments, setPayments] = useState([]);
  const [plots, setPlots] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    plot_id: '',
    resident_id: '',
    amount: '',
    payment_type: '',
    due_date: '',
    payment_method: '',
    transaction_id: '',
    notes: '',
    status: 'pending'
  });

  const paymentTypes = [
    'Maintenance Fee',
    'Water Bill',
    'Electricity Bill',
    'Security Charges',
    'Parking Fee',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Online Transfer',
    'Cheque',
    'Bank Transfer',
    'UPI',
    'Card Payment'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'paid', label: 'Paid', color: 'success' },
    { value: 'overdue', label: 'Overdue', color: 'error' }
  ];

  const tabLabels = ['All Payments', 'Pending', 'Paid', 'Overdue'];
  const tabFilters = ['', 'pending', 'paid', 'overdue'];

  useEffect(() => {
    if (userData?.org_id) {
      fetchPayments();
      fetchPlots();
      fetchResidents();
    }
  }, [userData, page, rowsPerPage, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await axios.get(
        `${API_BASE_URL}/admin/payments/${userData.org_id}?${params}`
      );
      
      if (response.data.success) {
        setPayments(response.data.data);
        setTotalCount(response.data.pagination.total);
      } else {
        setError('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Fetch payments error:', error);
      setError('Failed to load payments data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlots = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/plots-dropdown/${userData.org_id}`);
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Fetch plots error:', error);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/residents/${userData.org_id}`);
      if (response.data.success) {
        setResidents(response.data.data);
      }
    } catch (error) {
      console.error('Fetch residents error:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setStatusFilter(tabFilters[newValue]);
    setPage(0);
  };

  const handleOpenDialog = (type, payment = null) => {
    setDialogType(type);
    setSelectedPayment(payment);
    
    if (type === 'add') {
      setFormData({
        plot_id: '',
        resident_id: '',
        amount: '',
        payment_type: '',
        due_date: '',
        payment_method: '',
        transaction_id: '',
        notes: '',
        status: 'pending'
      });
    } else if (type === 'edit' && payment) {
      setFormData({
        plot_id: payment.plot_id || '',
        resident_id: payment.resident_id || '',
        amount: payment.amount || '',
        payment_type: payment.payment_type || '',
        due_date: payment.due_date ? payment.due_date.split('T')[0] : '',
        payment_method: payment.payment_method || '',
        transaction_id: payment.transaction_id || '',
        notes: payment.notes || '',
        status: payment.status || 'pending'
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
    setFormData({
      plot_id: '',
      resident_id: '',
      amount: '',
      payment_type: '',
      due_date: '',
      payment_method: '',
      transaction_id: '',
      notes: '',
      status: 'pending'
    });
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (dialogType === 'add') {
        const response = await axios.post(`${API_BASE_URL}/admin/payments`, formData);
        if (response.data.success) {
          setSuccess('Payment record created successfully');
          fetchPayments();
          handleCloseDialog();
        } else {
          setError('Failed to create payment record');
        }
      } else if (dialogType === 'edit') {
        const updateData = {
          status: formData.status,
          payment_method: formData.payment_method,
          transaction_id: formData.transaction_id,
          notes: formData.notes
        };
        
        const response = await axios.put(
          `${API_BASE_URL}/admin/payments/${selectedPayment.payment_id}`,
          updateData
        );
        
        if (response.data.success) {
          setSuccess('Payment updated successfully');
          fetchPayments();
          handleCloseDialog();
        } else {
          setError('Failed to update payment');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Chip
        label={statusConfig?.label || status}
        color={statusConfig?.color || 'default'}
        size="small"
      />
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Calculate summary stats
  const summaryStats = payments.reduce((acc, payment) => {
    acc.total += parseFloat(payment.amount || 0);
    if (payment.status === 'paid') {
      acc.collected += parseFloat(payment.amount || 0);
    } else if (payment.status === 'pending') {
      acc.pending += parseFloat(payment.amount || 0);
    } else if (payment.status === 'overdue') {
      acc.overdue += parseFloat(payment.amount || 0);
    }
    return acc;
  }, { total: 0, collected: 0, pending: 0, overdue: 0 });

  if (loading && payments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payments Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonetizationOn color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(summaryStats.total)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">Collected</Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(summaryStats.collected)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingActions color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4" color="warning.main">
                    {formatCurrency(summaryStats.pending)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PaymentIcon color="error" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">Overdue</Typography>
                  <Typography variant="h4" color="error.main">
                    {formatCurrency(summaryStats.overdue)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        {/* Header with Add Button and Tabs */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Payment
          </Button>
        </Box>

        {/* Payments Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Plot/Resident</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>#{payment.payment_id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Plot {payment.plot_no}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {payment.resident_name || 'N/A'}
                      </Typography>
                      {payment.street_name && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {payment.street_name}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.payment_type}</TableCell>
                  <TableCell>{formatDate(payment.due_date)}</TableCell>
                  <TableCell>{getStatusChip(payment.status)}</TableCell>
                  <TableCell>{payment.payment_method || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('view', payment)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('edit', payment)}
                      title="Edit Payment"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Payment'}
          {dialogType === 'edit' && 'Edit Payment'}
          {dialogType === 'view' && 'Payment Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType !== 'view' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Plot</InputLabel>
                    <Select
                      name="plot_id"
                      value={formData.plot_id}
                      onChange={handleInputChange}
                      disabled={dialogType === 'edit'}
                    >
                      {plots.map((plot) => (
                        <MenuItem key={plot.plot_id} value={plot.plot_id}>
                          Plot {plot.plot_no}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Resident</InputLabel>
                    <Select
                      name="resident_id"
                      value={formData.resident_id}
                      onChange={handleInputChange}
                      disabled={dialogType === 'edit'}
                    >
                      {residents
                        .filter(r => !formData.plot_id || r.plot_id == formData.plot_id)
                        .map((resident) => (
                          <MenuItem key={resident.resident_id} value={resident.resident_id}>
                            {resident.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                {dialogType === 'add' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleInputChange}
                        InputProps={{ startAdornment: '₹' }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Type</InputLabel>
                        <Select
                          name="payment_type"
                          value={formData.payment_type}
                          onChange={handleInputChange}
                        >
                          {paymentTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        name="due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                    >
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Transaction ID"
                    name="transaction_id"
                    value={formData.transaction_id}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'view' && selectedPayment && (
              <Grid item xs={12}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Payment Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Payment ID:</Typography>
                      <Typography variant="body1">#{selectedPayment.payment_id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Amount:</Typography>
                      <Typography variant="body1">{formatCurrency(selectedPayment.amount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Payment Type:</Typography>
                      <Typography variant="body1">{selectedPayment.payment_type}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Status:</Typography>
                      <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedPayment.status)}</Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Due Date:</Typography>
                      <Typography variant="body1">{formatDate(selectedPayment.due_date)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Payment Method:</Typography>
                      <Typography variant="body1">{selectedPayment.payment_method || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Transaction ID:</Typography>
                      <Typography variant="body1">{selectedPayment.transaction_id || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Notes:</Typography>
                      <Typography variant="body1">{selectedPayment.notes || 'No notes'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType !== 'view' && (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : (dialogType === 'add' ? 'Add Payment' : 'Update Payment')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsManagement;