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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const ResidentsManagement = () => {
  const [residents, setResidents] = useState([
    {
      id: 1,
      name: 'John Doe',
      contactNumber: '+1234567890',
      email: 'john@example.com',
      idProof: 'DL123456',
      ownershipType: 'Owner',
      plotId: 1,
      flatId: null,
    },
    {
      id: 2,
      name: 'Jane Smith',
      contactNumber: '+1987654321',
      email: 'jane@example.com',
      idProof: 'PP789012',
      ownershipType: 'Tenant',
      plotId: 2,
      flatId: 1,
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
  const [editingResident, setEditingResident] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    idProof: '',
    ownershipType: 'Owner',
    plotId: '',
    flatId: '',
  });

  const handleOpenDialog = (resident = null) => {
    if (resident) {
      setEditingResident(resident);
      setFormData({
        name: resident.name,
        contactNumber: resident.contactNumber,
        email: resident.email,
        idProof: resident.idProof,
        ownershipType: resident.ownershipType,
        plotId: resident.plotId,
        flatId: resident.flatId,
      });
      setSelectedPlot(plots.find(p => p.id === resident.plotId));
    } else {
      setEditingResident(null);
      setFormData({
        name: '',
        contactNumber: '',
        email: '',
        idProof: '',
        ownershipType: 'Owner',
        plotId: '',
        flatId: '',
      });
      setSelectedPlot(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResident(null);
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
    if (editingResident) {
      setResidents((prev) =>
        prev.map((resident) =>
          resident.id === editingResident.id
            ? { ...resident, ...formData }
            : resident
        )
      );
    } else {
      const newResident = {
        id: residents.length + 1,
        ...formData,
      };
      setResidents((prev) => [...prev, newResident]);
    }
    handleCloseDialog();
  };

  const handleDelete = (residentId) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      setResidents((prev) => prev.filter((resident) => resident.id !== residentId));
    }
  };

  const getResidentLocation = (resident) => {
    const plot = plots.find(p => p.id === resident.plotId);
    if (!plot) return 'Unknown';
    
    if (plot.type === 'Individual') {
      return `Plot ${plot.number}`;
    } else {
      const flat = plot.flats.find(f => f.id === resident.flatId);
      return `Plot ${plot.number}, Flat ${flat?.number || 'Unknown'}`;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Residents Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Resident
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>ID Proof</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    {resident.contactNumber}
                    <EmailIcon fontSize="small" sx={{ ml: 2 }} />
                    {resident.email}
                  </Box>
                </TableCell>
                <TableCell>{getResidentLocation(resident)}</TableCell>
                <TableCell>{resident.ownershipType}</TableCell>
                <TableCell>{resident.idProof}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(resident)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(resident.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingResident ? 'Edit Resident' : 'Add New Resident'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            value={formData.contactNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="idProof"
            label="ID Proof (Optional)"
            type="text"
            fullWidth
            value={formData.idProof}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Ownership Type</InputLabel>
            <Select
              name="ownershipType"
              value={formData.ownershipType}
              onChange={handleInputChange}
            >
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Tenant">Tenant</MenuItem>
            </Select>
          </FormControl>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingResident ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResidentsManagement;
