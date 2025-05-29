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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const StreetsManagement = () => {
  const [streets, setStreets] = useState([
    { id: 1, name: 'Maple Avenue', totalPlots: 15, description: 'North sector main street' },
    { id: 2, name: 'Oak Street', totalPlots: 12, description: 'South sector residential area' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingStreet, setEditingStreet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenDialog = (street = null) => {
    if (street) {
      setEditingStreet(street);
      setFormData({
        name: street.name,
        description: street.description,
      });
    } else {
      setEditingStreet(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStreet(null);
    setFormData({ name: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (editingStreet) {
      // Update existing street
      setStreets((prev) =>
        prev.map((street) =>
          street.id === editingStreet.id
            ? { ...street, ...formData }
            : street
        )
      );
    } else {
      // Add new street
      const newStreet = {
        id: streets.length + 1,
        ...formData,
        totalPlots: 0,
      };
      setStreets((prev) => [...prev, newStreet]);
    }
    handleCloseDialog();
  };

  const handleDelete = (streetId) => {
    if (window.confirm('Are you sure you want to delete this street?')) {
      setStreets((prev) => prev.filter((street) => street.id !== streetId));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Streets Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Street
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Street Name</TableCell>
              <TableCell>Total Plots</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {streets.map((street) => (
              <TableRow key={street.id}>
                <TableCell>{street.name}</TableCell>
                <TableCell>{street.totalPlots}</TableCell>
                <TableCell>{street.description}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(street)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(street.id)}
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
          {editingStreet ? 'Edit Street' : 'Add New Street'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Street Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStreet ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StreetsManagement;
