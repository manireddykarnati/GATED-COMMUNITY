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
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const PlotsManagement = () => {
  const [plots, setPlots] = useState([
    {
      id: 1,
      number: 'P101',
      streetId: 1,
      type: 'Individual',
      size: '2400 sqft',
      flats: [],
    },
    {
      id: 2,
      number: 'P102',
      streetId: 1,
      type: 'Flats',
      size: '3600 sqft',
      flats: [
        { id: 1, number: '101', floor: 1, size: '1200 sqft' },
        { id: 2, number: '102', floor: 1, size: '1200 sqft' },
      ],
    },
  ]);

  const [streets] = useState([
    { id: 1, name: 'Maple Avenue' },
    { id: 2, name: 'Oak Street' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openFlatDialog, setOpenFlatDialog] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [editingFlat, setEditingFlat] = useState(null);
  const [expandedPlot, setExpandedPlot] = useState(null);
  const [selectedPlotForFlat, setSelectedPlotForFlat] = useState(null);

  const [plotFormData, setPlotFormData] = useState({
    number: '',
    streetId: '',
    type: 'Individual',
    size: '',
  });

  const [flatFormData, setFlatFormData] = useState({
    number: '',
    floor: '',
    size: '',
  });

  const handleOpenDialog = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setPlotFormData({
        number: plot.number,
        streetId: plot.streetId,
        type: plot.type,
        size: plot.size,
      });
    } else {
      setEditingPlot(null);
      setPlotFormData({
        number: '',
        streetId: '',
        type: 'Individual',
        size: '',
      });
    }
    setOpenDialog(true);
  };

  const handleOpenFlatDialog = (plot, flat = null) => {
    setSelectedPlotForFlat(plot);
    if (flat) {
      setEditingFlat(flat);
      setFlatFormData({
        number: flat.number,
        floor: flat.floor,
        size: flat.size,
      });
    } else {
      setEditingFlat(null);
      setFlatFormData({
        number: '',
        floor: '',
        size: '',
      });
    }
    setOpenFlatDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlot(null);
  };

  const handleCloseFlatDialog = () => {
    setOpenFlatDialog(false);
    setEditingFlat(null);
    setSelectedPlotForFlat(null);
  };

  const handlePlotInputChange = (e) => {
    const { name, value } = e.target;
    setPlotFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFlatInputChange = (e) => {
    const { name, value } = e.target;
    setFlatFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlotSubmit = () => {
    if (editingPlot) {
      setPlots((prev) =>
        prev.map((plot) =>
          plot.id === editingPlot.id
            ? { ...plot, ...plotFormData }
            : plot
        )
      );
    } else {
      const newPlot = {
        id: plots.length + 1,
        ...plotFormData,
        flats: [],
      };
      setPlots((prev) => [...prev, newPlot]);
    }
    handleCloseDialog();
  };

  const handleFlatSubmit = () => {
    if (editingFlat) {
      setPlots((prev) =>
        prev.map((plot) =>
          plot.id === selectedPlotForFlat.id
            ? {
                ...plot,
                flats: plot.flats.map((flat) =>
                  flat.id === editingFlat.id
                    ? { ...flat, ...flatFormData }
                    : flat
                ),
              }
            : plot
        )
      );
    } else {
      const newFlat = {
        id: selectedPlotForFlat.flats.length + 1,
        ...flatFormData,
      };
      setPlots((prev) =>
        prev.map((plot) =>
          plot.id === selectedPlotForFlat.id
            ? { ...plot, flats: [...plot.flats, newFlat] }
            : plot
        )
      );
    }
    handleCloseFlatDialog();
  };

  const handleDeletePlot = (plotId) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      setPlots((prev) => prev.filter((plot) => plot.id !== plotId));
    }
  };

  const handleDeleteFlat = (plotId, flatId) => {
    if (window.confirm('Are you sure you want to delete this flat?')) {
      setPlots((prev) =>
        prev.map((plot) =>
          plot.id === plotId
            ? {
                ...plot,
                flats: plot.flats.filter((flat) => flat.id !== flatId),
              }
            : plot
        )
      );
    }
  };

  const togglePlotExpand = (plotId) => {
    setExpandedPlot(expandedPlot === plotId ? null : plotId);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Plots & Flats Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Plot
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plot Number</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.map((plot) => (
              <React.Fragment key={plot.id}>
                <TableRow>
                  <TableCell>{plot.number}</TableCell>
                  <TableCell>
                    {streets.find((s) => s.id === plot.streetId)?.name}
                  </TableCell>
                  <TableCell>{plot.type}</TableCell>
                  <TableCell>{plot.size}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(plot)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePlot(plot.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {plot.type === 'Flats' && (
                      <>
                        <IconButton onClick={() => togglePlotExpand(plot.id)}>
                          {expandedPlot === plot.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenFlatDialog(plot)}
                        >
                          Add Flat
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {plot.type === 'Flats' && (
                  <TableRow>
                    <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedPlot === plot.id}>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Flats
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Flat Number</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {plot.flats.map((flat) => (
                                <TableRow key={flat.id}>
                                  <TableCell>{flat.number}</TableCell>
                                  <TableCell>{flat.floor}</TableCell>
                                  <TableCell>{flat.size}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleOpenFlatDialog(plot, flat)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteFlat(plot.id, flat.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Plot Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingPlot ? 'Edit Plot' : 'Add New Plot'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="number"
            label="Plot Number"
            type="text"
            fullWidth
            value={plotFormData.number}
            onChange={handlePlotInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Street</InputLabel>
            <Select
              name="streetId"
              value={plotFormData.streetId}
              onChange={handlePlotInputChange}
            >
              {streets.map((street) => (
                <MenuItem key={street.id} value={street.id}>
                  {street.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={plotFormData.type}
              onChange={handlePlotInputChange}
            >
              <MenuItem value="Individual">Individual House</MenuItem>
              <MenuItem value="Flats">Flats</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="size"
            label="Size (sqft)"
            type="text"
            fullWidth
            value={plotFormData.size}
            onChange={handlePlotInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handlePlotSubmit} variant="contained">
            {editingPlot ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flat Dialog */}
      <Dialog open={openFlatDialog} onClose={handleCloseFlatDialog}>
        <DialogTitle>
          {editingFlat ? 'Edit Flat' : 'Add New Flat'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="number"
            label="Flat Number"
            type="text"
            fullWidth
            value={flatFormData.number}
            onChange={handleFlatInputChange}
          />
          <TextField
            margin="dense"
            name="floor"
            label="Floor"
            type="number"
            fullWidth
            value={flatFormData.floor}
            onChange={handleFlatInputChange}
          />
          <TextField
            margin="dense"
            name="size"
            label="Size (sqft)"
            type="text"
            fullWidth
            value={flatFormData.size}
            onChange={handleFlatInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlatDialog}>Cancel</Button>
          <Button onClick={handleFlatSubmit} variant="contained">
            {editingFlat ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlotsManagement;
