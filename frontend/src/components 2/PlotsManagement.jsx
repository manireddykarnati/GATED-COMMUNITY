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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material';
import axios from 'axios';

const PlotsManagement = () => {
  const [plots, setPlots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [flats, setFlats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFlatDialog, setOpenFlatDialog] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [selectedPlotId, setSelectedPlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [plotForm, setPlotForm] = useState({
    street_id: '',
    plot_type: 'Individual',
    plot_no: ''
  });

  const [flatForm, setFlatForm] = useState({
    flat_no: '',
    eb_card: ''
  });

  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const orgId = userData?.org_id;

  useEffect(() => {
    if (orgId) {
      fetchPlots();
      fetchStreets();
    }
  }, [orgId]);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/plots/${orgId}`);
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching plots:', error);
      showSnackbar('Error fetching plots', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStreets = async () => {
    try {
      const response = await axios.get(`/api/admin/streets-dropdown/${orgId}`);
      if (response.data.success) {
        setStreets(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching streets:', error);
    }
  };

  const fetchFlats = async (plotId) => {
    try {
      const response = await axios.get(`/api/admin/flats/${plotId}`);
      if (response.data.success) {
        setFlats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setPlotForm({
        street_id: plot.street_id || '',
        plot_type: plot.plot_type || 'Individual',
        plot_no: plot.plot_no || ''
      });
    } else {
      setEditingPlot(null);
      setPlotForm({
        street_id: '',
        plot_type: 'Individual',
        plot_no: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlot(null);
    setPlotForm({
      street_id: '',
      plot_type: 'Individual',
      plot_no: ''
    });
  };

  const handleSubmitPlot = async () => {
    try {
      if (!plotForm.street_id || !plotForm.plot_no) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const plotData = {
        ...plotForm,
        org_id: orgId
      };

      if (editingPlot) {
        const response = await axios.put(`/api/admin/plots/${editingPlot.plot_id}`, plotData);
        if (response.data.success) {
          showSnackbar('Plot updated successfully');
          fetchPlots();
        }
      } else {
        const response = await axios.post('/api/admin/plots', plotData);
        if (response.data.success) {
          showSnackbar('Plot created successfully');
          fetchPlots();
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving plot:', error);
      showSnackbar(error.response?.data?.message || 'Error saving plot', 'error');
    }
  };

  const handleDeletePlot = async (plotId) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      try {
        const response = await axios.delete(`/api/admin/plots/${plotId}`);
        if (response.data.success) {
          showSnackbar('Plot deleted successfully');
          fetchPlots();
        }
      } catch (error) {
        console.error('Error deleting plot:', error);
        showSnackbar(error.response?.data?.message || 'Error deleting plot', 'error');
      }
    }
  };

  const handleOpenFlatDialog = (plotId) => {
    setSelectedPlotId(plotId);
    setFlatForm({ flat_no: '', eb_card: '' });
    fetchFlats(plotId);
    setOpenFlatDialog(true);
  };

  const handleCloseFlatDialog = () => {
    setOpenFlatDialog(false);
    setSelectedPlotId(null);
    setFlats([]);
  };

  const handleSubmitFlat = async () => {
    try {
      if (!flatForm.flat_no) {
        showSnackbar('Please enter flat number', 'error');
        return;
      }

      const flatData = {
        ...flatForm,
        plot_id: selectedPlotId
      };

      const response = await axios.post('/api/admin/flats', flatData);
      if (response.data.success) {
        showSnackbar('Flat added successfully');
        fetchFlats(selectedPlotId);
        setFlatForm({ flat_no: '', eb_card: '' });
      }
    } catch (error) {
      console.error('Error adding flat:', error);
      showSnackbar(error.response?.data?.message || 'Error adding flat', 'error');
    }
  };

  const getStreetName = (streetId) => {
    const street = streets.find(s => s.street_id === streetId);
    return street ? street.street_name : 'Unknown Street';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Plots & Flats Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Plot
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plot No</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Residents</TableCell>
              <TableCell>Flats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.map((plot) => (
              <TableRow key={plot.plot_id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {plot.plot_type === 'Flats' ? (
                      <ApartmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    ) : (
                      <HomeIcon sx={{ mr: 1, color: 'success.main' }} />
                    )}
                    {plot.plot_no}
                  </Box>
                </TableCell>
                <TableCell>{plot.street_name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={plot.plot_type}
                    color={plot.plot_type === 'Flats' ? 'primary' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{plot.resident_count || 0}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {plot.flat_count || 0} flats
                    </Typography>
                    {plot.plot_type === 'Flats' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenFlatDialog(plot.plot_id)}
                      >
                        Manage Flats
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(plot)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePlot(plot.plot_id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {plots.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No plots found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Plot Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlot ? 'Edit Plot' : 'Add New Plot'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Street</InputLabel>
                <Select
                  value={plotForm.street_id}
                  label="Street"
                  onChange={(e) => setPlotForm({ ...plotForm, street_id: e.target.value })}
                >
                  {streets.map((street) => (
                    <MenuItem key={street.street_id} value={street.street_id}>
                      {street.street_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Plot Number"
                value={plotForm.plot_no}
                onChange={(e) => setPlotForm({ ...plotForm, plot_no: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Plot Type</InputLabel>
                <Select
                  value={plotForm.plot_type}
                  label="Plot Type"
                  onChange={(e) => setPlotForm({ ...plotForm, plot_type: e.target.value })}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Flats">Flats</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitPlot} variant="contained">
            {editingPlot ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flats Management Dialog */}
      <Dialog open={openFlatDialog} onClose={handleCloseFlatDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Manage Flats
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Add New Flat</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Flat Number"
                  value={flatForm.flat_no}
                  onChange={(e) => setFlatForm({ ...flatForm, flat_no: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="EB Card Number"
                  value={flatForm.eb_card}
                  onChange={(e) => setFlatForm({ ...flatForm, eb_card: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmitFlat}
                  sx={{ height: '56px' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" gutterBottom>Existing Flats</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Flat Number</TableCell>
                  <TableCell>EB Card</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flats.map((flat) => (
                  <TableRow key={flat.flat_id}>
                    <TableCell>{flat.flat_no}</TableCell>
                    <TableCell>{flat.eb_card || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {flats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No flats added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlatDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlotsManagement;