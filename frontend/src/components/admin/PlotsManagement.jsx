// src/components/admin/PlotsManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Paper
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import PageWrapper from './PageWrapper';

const PlotsManagement = () => {
  const org_id = 1;
  const [plots, setPlots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editPlot, setEditPlot] = useState(null);

  const [form, setForm] = useState({
    street_id: '',
    plot_type: 'Individual',
    plot_no: ''
  });

  useEffect(() => {
    fetchPlots();
    fetchStreets();
  }, []);

  const fetchPlots = async () => {
    try {
      const res = await axios.get(`/api/admin/plots/${org_id}`);
      setPlots(res.data);
    } catch (err) {
      console.error('Fetch plots failed', err);
    }
  };

  const fetchStreets = async () => {
    try {
      const res = await axios.get(`/api/admin/streets/${org_id}`);
      setStreets(res.data);
    } catch (err) {
      console.error('Fetch streets failed', err);
    }
  };

  const handleOpen = (plot = null) => {
    if (plot) {
      setEditPlot(plot);
      setForm({
        street_id: plot.street_id,
        plot_type: plot.plot_type,
        plot_no: plot.plot_no
      });
    } else {
      setEditPlot(null);
      setForm({ street_id: '', plot_type: 'Individual', plot_no: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditPlot(null);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (editPlot) {
        await axios.put(`/api/admin/plots/${editPlot.plot_id}`, form);
      } else {
        await axios.post(`/api/admin/plots`, { ...form, org_id });
      }
      fetchPlots();
      handleClose();
    } catch (err) {
      console.error('Save plot error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    try {
      await axios.delete(`/api/admin/plots/${id}`);
      fetchPlots();
    } catch (err) {
      console.error('Delete plot error:', err);
    }
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Plots</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Plot
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>Plot No</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.map((plot, i) => (
              <TableRow key={plot.plot_id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{plot.street_name}</TableCell>
                <TableCell>{plot.plot_no}</TableCell>
                <TableCell>{plot.plot_type}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(plot)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(plot.plot_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editPlot ? 'Edit Plot' : 'Add Plot'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Street</InputLabel>
            <Select
              name="street_id"
              value={form.street_id}
              onChange={handleChange}
              label="Street"
            >
              {streets.map((s) => (
                <MenuItem key={s.street_id} value={s.street_id}>
                  {s.street_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="plot_no"
            label="Plot Number"
            fullWidth
            value={form.plot_no}
            onChange={handleChange}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="plot_type"
              value={form.plot_type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Flats">Flats</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editPlot ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default PlotsManagement;
