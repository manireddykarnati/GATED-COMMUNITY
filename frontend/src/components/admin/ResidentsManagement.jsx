// src/components/admin/ResidentsManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const ResidentsManagement = () => {
  const org_id = 1;
  const [residents, setResidents] = useState([]);
  const [plots, setPlots] = useState([]);
  const [flats, setFlats] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editResident, setEditResident] = useState(null);

  const [form, setForm] = useState({
    name: '',
    contact_number: '',
    email: '',
    id_proof: '',
    plot_id: '',
    flat_id: ''
  });

  useEffect(() => {
    fetchResidents();
    fetchPlots();
  }, []);

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

  const fetchFlats = async (plotId) => {
    try {
      const res = await axios.get(`/api/admin/flats/${plotId}`);
      setFlats(res.data);
    } catch (err) {
      console.error('Error fetching flats:', err);
    }
  };

  const handleOpen = (resident = null) => {
    if (resident) {
      setEditResident(resident);
      setForm({
        name: resident.name,
        contact_number: resident.contact_number || '',
        email: resident.email || '',
        id_proof: resident.id_proof || '',
        plot_id: resident.plot_id,
        flat_id: resident.flat_id || ''
      });
      fetchFlats(resident.plot_id);
    } else {
      setEditResident(null);
      setForm({ name: '', contact_number: '', email: '', id_proof: '', plot_id: '', flat_id: '' });
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditResident(null);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'plot_id') {
      fetchFlats(e.target.value);
      setForm(prev => ({ ...prev, flat_id: '' }));
    }
  };

  const handleSave = async () => {
    try {
      if (editResident) {
        await axios.put(`/api/admin/residents/${editResident.resident_id}`, form);
      } else {
        await axios.post(`/api/admin/residents`, form);
      }
      fetchResidents();
      handleClose();
    } catch (err) {
      console.error('Error saving resident:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resident?')) return;
    try {
      await axios.delete(`/api/admin/residents/${id}`);
      fetchResidents();
    } catch (err) {
      console.error('Error deleting resident:', err);
    }
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Residents</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Resident
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plot</TableCell>
              <TableCell>Flat</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((r, index) => (
              <TableRow key={r.resident_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.contact_number}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.plot_no}</TableCell>
                <TableCell>{r.flat_no || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(r)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(r.resident_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{editResident ? 'Edit Resident' : 'Add Resident'}</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="contact_number" label="Contact Number" value={form.contact_number} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="id_proof" label="ID Proof" value={form.id_proof} onChange={handleChange} fullWidth margin="dense" />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Plot</InputLabel>
            <Select name="plot_id" value={form.plot_id} onChange={handleChange} label="Plot">
              {plots.map(p => (
                <MenuItem key={p.plot_id} value={p.plot_id}>{p.plot_no}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flat</InputLabel>
            <Select name="flat_id" value={form.flat_id || ''} onChange={handleChange} label="Flat">
              <MenuItem value="">(None)</MenuItem>
              {flats.map(f => (
                <MenuItem key={f.flat_id} value={f.flat_id}>{f.flat_no}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editResident ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default ResidentsManagement;
