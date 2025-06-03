import React, { useState, useEffect } from 'react';
import {
  Container,
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
  IconButton,
  Box,
  Alert,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationCity as StreetIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StreetsManagement = ({ userData }) => {
  const [streets, setStreets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStreet, setEditingStreet] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userData?.org_id) {
      fetchStreets();
    }
  }, [userData]);

  const fetchStreets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/streets/${userData.org_id}`);
      if (response.data.success) {
        setStreets(response.data.data);
      } else {
        setError('Failed to fetch streets');
      }
    } catch (error) {
      console.error('Fetch streets error:', error);
      setError('Failed to load streets data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (street = null) => {
    setEditingStreet(street);
    setStreetName(street ? street.street_name : '');
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStreet(null);
    setStreetName('');
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!streetName.trim()) {
      setError('Street name is required');
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (editingStreet) {
        // Update existing street
        response = await axios.put(`${API_BASE_URL}/admin/streets/${editingStreet.street_id}`, {
          street_name: streetName.trim(),
        });
      } else {
        // Create new street
        response = await axios.post(`${API_BASE_URL}/admin/streets`, {
          org_id: userData.org_id,
          street_name: streetName.trim(),
        });
      }

      if (response.data.success) {
        setSuccess(editingStreet ? 'Street updated successfully' : 'Street created successfully');
        fetchStreets();
        handleCloseDialog();
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit street error:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (streetId, streetName) => {
    if (!window.confirm(`Are you sure you want to delete "${streetName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/streets/${streetId}`);
      if (response.data.success) {
        setSuccess('Street deleted successfully');
        fetchStreets();
      } else {
        setError(response.data.message || 'Failed to delete street');
      }
    } catch (error) {
      console.error('Delete street error:', error);
      setError(error.response?.data?.message || 'Failed to delete street');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading streets...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <StreetIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5">Streets Management</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Street
          </Button>
        </Box>

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
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4">{streets.length}</Typography>
              <Typography variant="body2">Total Streets</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h4">
                {streets.reduce((sum, street) => sum + parseInt(street.plot_count), 0)}
              </Typography>
              <Typography variant="body2">Total Plots</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h4">
                {streets.filter(street => parseInt(street.plot_count) > 0).length}
              </Typography>
              <Typography variant="body2">Active Streets</Typography>
            </Paper>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Street ID</strong></TableCell>
                <TableCell><strong>Street Name</strong></TableCell>
                <TableCell><strong>Number of Plots</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {streets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No streets found. Click "Add New Street" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                streets.map((street) => (
                  <TableRow key={street.street_id} hover>
                    <TableCell>{street.street_id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {street.street_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${street.plot_count} plots`}
                        color={parseInt(street.plot_count) > 0 ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={parseInt(street.plot_count) > 0 ? "Active" : "Empty"}
                        color={parseInt(street.plot_count) > 0 ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(street)}
                        title="Edit Street"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(street.street_id, street.street_name)}
                        disabled={parseInt(street.plot_count) > 0}
                        title={parseInt(street.plot_count) > 0 ? "Cannot delete street with plots" : "Delete Street"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStreet ? 'Edit Street' : 'Add New Street'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Street Name"
            fullWidth
            variant="outlined"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="e.g., Main Street, Oak Avenue, etc."
            error={!streetName.trim() && submitting}
            helperText={!streetName.trim() && submitting ? 'Street name is required' : ''}
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting || !streetName.trim()}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Saving...' : (editingStreet ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StreetsManagement;