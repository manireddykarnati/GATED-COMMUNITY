// src/components/admin/StreetsManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Paper
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const StreetsManagement = () => {
  const org_id = 1; // or fetch from user context
  const [streets, setStreets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editStreet, setEditStreet] = useState(null);
  const [streetName, setStreetName] = useState('');

  // Fetch streets
  const fetchStreets = async () => {
    try {
      const res = await axios.get(`/api/admin/streets/${org_id}`);
      setStreets(res.data);
    } catch (err) {
      console.error('Error fetching streets:', err);
    }
  };

  useEffect(() => {
    fetchStreets();
  }, []);

  // Add or update street
  const handleSave = async () => {
    try {
      if (editStreet) {
        await axios.put(`/api/admin/streets/${editStreet.street_id}`, { street_name: streetName });
      } else {
        await axios.post('/api/admin/streets', { org_id, street_name: streetName });
      }
      fetchStreets();
      setOpen(false);
      setStreetName('');
      setEditStreet(null);
    } catch (err) {
      console.error('Error saving street:', err);
    }
  };

  const handleEdit = (street) => {
    setEditStreet(street);
    setStreetName(street.street_name);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this street?')) return;
    try {
      await axios.delete(`/api/admin/streets/${id}`);
      fetchStreets();
    } catch (err) {
      console.error('Error deleting street:', err);
    }
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Streets</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Street
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Street Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {streets.map((street, index) => (
              <TableRow key={street.street_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{street.street_name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(street)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(street.street_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editStreet ? 'Edit Street' : 'Add Street'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Street Name"
            fullWidth
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editStreet ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default StreetsManagement;
