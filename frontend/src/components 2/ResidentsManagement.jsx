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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ResidentsManagement = ({ userData }) => {
  // State management
  const [residents, setResidents] = useState([]);
  const [streets, setStreets] = useState([]);
  const [plots, setPlots] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [editingResident, setEditingResident] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStreet, setFilterStreet] = useState('');
  const [filterPlot, setFilterPlot] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    plot_id: '',
    flat_id: '',
    name: '',
    contact_number: '',
    email: '',
    id_proof: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Load data on component mount
  useEffect(() => {
    if (userData?.org_id) {
      loadResidents();
      loadStreets();
    }
  }, [userData]);

  // Load plots when street is selected
  useEffect(() => {
    if (filterStreet) {
      loadPlots(filterStreet);
    } else {
      loadAllPlots();
    }
  }, [filterStreet]);

  // Load flats when plot is selected in form
  useEffect(() => {
    if (formData.plot_id) {
      loadFlats(formData.plot_id);
    }
  }, [formData.plot_id]);

  // API calls
  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/residents/${userData.org_id}`);
      if (response.data.success) {
        setResidents(response.data.data);
      } else {
        setError('Failed to load residents');
      }
    } catch (error) {
      console.error('Load residents error:', error);
      setError('Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const loadStreets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/streets-dropdown/${userData.org_id}`);
      if (response.data.success) {
        setStreets(response.data.data);
      }
    } catch (error) {
      console.error('Load streets error:', error);
    }
  };

  const loadPlots = async (streetId = null) => {
    try {
      const url = streetId 
        ? `${API_BASE_URL}/admin/plots-dropdown/${userData.org_id}?street_id=${streetId}`
        : `${API_BASE_URL}/admin/plots-dropdown/${userData.org_id}`;
      const response = await axios.get(url);
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Load plots error:', error);
    }
  };

  const loadAllPlots = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/plots-dropdown/${userData.org_id}`);
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (error) {
      console.error('Load plots error:', error);
    }
  };

  const loadFlats = async (plotId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/flats/${plotId}`);
      if (response.data.success) {
        setFlats(response.data.data);
      } else {
        setFlats([]);
      }
    } catch (error) {
      console.error('Load flats error:', error);
      setFlats([]);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.plot_id) {
      errors.plot_id = 'Plot is required';
    }
    
    if (formData.contact_number && !/^\d{10}$/.test(formData.contact_number.replace(/\D/g, ''))) {
      errors.contact_number = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        const response = await axios.post(`${API_BASE_URL}/admin/residents`, formData);
        if (response.data.success) {
          setSuccess('Resident added successfully');
          loadResidents();
          handleCloseDialog();
        } else {
          setError('Failed to add resident');
        }
      } else {
        const response = await axios.put(
          `${API_BASE_URL}/admin/residents/${editingResident.resident_id}`,
          {
            name: formData.name,
            contact_number: formData.contact_number,
            email: formData.email,
            id_proof: formData.id_proof
          }
        );
        if (response.data.success) {
          setSuccess('Resident updated successfully');
          loadResidents();
          handleCloseDialog();
        } else {
          setError('Failed to update resident');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(dialogMode === 'add' ? 'Failed to add resident' : 'Failed to update resident');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (resident) => {
    if (window.confirm(`Are you sure you want to delete ${resident.name}?`)) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_BASE_URL}/admin/residents/${resident.resident_id}`);
        if (response.data.success) {
          setSuccess('Resident deleted successfully');
          loadResidents();
        } else {
          setError('Failed to delete resident');
        }
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete resident');
      } finally {
        setLoading(false);
      }
    }
  };

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      plot_id: '',
      flat_id: '',
      name: '',
      contact_number: '',
      email: '',
      id_proof: ''
    });
    setFormErrors({});
    setFlats([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (resident) => {
    setDialogMode('edit');
    setEditingResident(resident);
    setFormData({
      plot_id: resident.plot_id || '',
      flat_id: resident.flat_id || '',
      name: resident.name || '',
      contact_number: resident.contact_number || '',
      email: resident.email || '',
      id_proof: resident.id_proof || ''
    });
    setFormErrors({});
    if (resident.plot_id) {
      loadFlats(resident.plot_id);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResident(null);
    setFormData({
      plot_id: '',
      flat_id: '',
      name: '',
      contact_number: '',
      email: '',
      id_proof: ''
    });
    setFormErrors({});
    setFlats([]);
  };

  // Filter residents based on search and filters
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.contact_number?.includes(searchTerm) ||
                         resident.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStreet = !filterStreet || resident.street_name === filterStreet;
    const matchesPlot = !filterPlot || resident.plot_no === filterPlot;
    
    return matchesSearch && matchesStreet && matchesPlot;
  });

  // Pagination
  const paginatedResidents = filteredResidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && residents.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Residents Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadResidents}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Resident
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{residents.length}</Typography>
                  <Typography color="textSecondary">Total Residents</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HomeIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {new Set(residents.map(r => r.plot_id)).size}
                  </Typography>
                  <Typography color="textSecondary">Occupied Plots</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EmailIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {residents.filter(r => r.email).length}
                  </Typography>
                  <Typography color="textSecondary">With Email</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Street</InputLabel>
              <Select
                value={filterStreet}
                onChange={(e) => setFilterStreet(e.target.value)}
                label="Filter by Street"
              >
                <MenuItem value="">All Streets</MenuItem>
                {streets.map((street) => (
                  <MenuItem key={street.street_id} value={street.street_name}>
                    {street.street_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Plot</InputLabel>
              <Select
                value={filterPlot}
                onChange={(e) => setFilterPlot(e.target.value)}
                label="Filter by Plot"
              >
                <MenuItem value="">All Plots</MenuItem>
                {plots.map((plot) => (
                  <MenuItem key={plot.plot_id} value={plot.plot_no}>
                    {plot.plot_no}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterStreet('');
                setFilterPlot('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Residents Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ID Proof</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResidents.map((resident) => (
                <TableRow key={resident.resident_id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography fontWeight="medium">
                        {resident.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        Plot {resident.plot_no}
                        {resident.flat_no && `, Flat ${resident.flat_no}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {resident.street_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {resident.contact_number ? (
                      <Box display="flex" alignItems="center">
                        <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                        <Typography variant="body2">
                          {resident.contact_number}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not provided
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {resident.email ? (
                      <Box display="flex" alignItems="center">
                        <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'info.main' }} />
                        <Typography variant="body2">
                          {resident.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not provided
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {resident.id_proof ? (
                      <Chip
                        icon={<BadgeIcon />}
                        label={resident.id_proof}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not provided
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Resident">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(resident)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Resident">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(resident)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedResidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {filteredResidents.length === 0 && searchTerm
                        ? 'No residents found matching your search.'
                        : 'No residents found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredResidents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Resident' : `Edit ${editingResident?.name}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                error={!!formErrors.contact_number}
                helperText={formErrors.contact_number}
                placeholder="10-digit mobile number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.plot_id} required>
                <InputLabel>Select Plot</InputLabel>
                <Select
                  value={formData.plot_id}
                  onChange={(e) => setFormData({ ...formData, plot_id: e.target.value, flat_id: '' })}
                  label="Select Plot"
                >
                  {plots.map((plot) => (
                    <MenuItem key={plot.plot_id} value={plot.plot_id}>
                      Plot {plot.plot_no}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.plot_id && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {formErrors.plot_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Flat (Optional)</InputLabel>
                <Select
                  value={formData.flat_id}
                  onChange={(e) => setFormData({ ...formData, flat_id: e.target.value })}
                  label="Select Flat (Optional)"
                  disabled={!formData.plot_id}
                >
                  <MenuItem value="">No Flat (Individual House)</MenuItem>
                  {flats.map((flat) => (
                    <MenuItem key={flat.flat_id} value={flat.flat_id}>
                      Flat {flat.flat_no}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                placeholder="resident@example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Proof"
                value={formData.id_proof}
                onChange={(e) => setFormData({ ...formData, id_proof: e.target.value })}
                placeholder="Aadhaar/PAN/Driving License"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              dialogMode === 'add' ? 'Add Resident' : 'Update Resident'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResidentsManagement;