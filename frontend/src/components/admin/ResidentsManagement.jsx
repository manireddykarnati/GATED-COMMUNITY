import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResidentsManagement = () => {
  const org_id = 1;
  const [residents, setResidents] = useState([]);
  const [plots, setPlots] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState('');
  const [newResident, setNewResident] = useState({
    plot_id: '',
    flat_id: '',
    name: '',
    contact_number: '',
    email: '',
    id_proof: ''
  });

  const fetchResidents = async () => {
    const res = await axios.get(`/api/admin/residents/${org_id}`);
    setResidents(res.data);
  };

  const fetchPlots = async () => {
    const res = await axios.get(`/api/admin/plots/${org_id}`);
    setPlots(res.data);
  };

  const fetchFlats = async (plotId) => {
    const res = await axios.get(`/api/admin/flats/${plotId}`);
    setFlats(res.data);
  };

  const handlePlotChange = (plotId) => {
    setSelectedPlot(plotId);
    setNewResident({ ...newResident, plot_id: plotId, flat_id: '' });
    fetchFlats(plotId);
  };

  const handleAddResident = async () => {
    await axios.post('/api/admin/residents', newResident);
    setNewResident({ plot_id: '', flat_id: '', name: '', contact_number: '', email: '', id_proof: '' });
    setSelectedPlot('');
    fetchResidents();
  };

  const handleDeleteResident = async (id) => {
    await axios.delete(`/api/admin/residents/${id}`);
    fetchResidents();
  };

  useEffect(() => {
    fetchResidents();
    fetchPlots();
  }, []);

  return (
    <div>
      <h3>Resident Management</h3>

      <div>
        <select value={newResident.plot_id} onChange={(e) => handlePlotChange(e.target.value)}>
          <option value="">Select Plot</option>
          {plots.map((p) => (
            <option key={p.plot_id} value={p.plot_id}>
              {p.plot_no}
            </option>
          ))}
        </select>

        {plots.find(p => p.plot_id === Number(selectedPlot))?.plot_type === 'Flats' && (
          <select
            value={newResident.flat_id}
            onChange={(e) => setNewResident({ ...newResident, flat_id: e.target.value })}
          >
            <option value="">Select Flat</option>
            {flats.map((f) => (
              <option key={f.flat_id} value={f.flat_id}>
                {f.flat_no}
              </option>
            ))}
          </select>
        )}

        <input
          placeholder="Name"
          value={newResident.name}
          onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
        />
        <input
          placeholder="Contact"
          value={newResident.contact_number}
          onChange={(e) => setNewResident({ ...newResident, contact_number: e.target.value })}
        />
        <input
          placeholder="Email"
          value={newResident.email}
          onChange={(e) => setNewResident({ ...newResident, email: e.target.value })}
        />
        <input
          placeholder="ID Proof"
          value={newResident.id_proof}
          onChange={(e) => setNewResident({ ...newResident, id_proof: e.target.value })}
        />
        <button onClick={handleAddResident}>Add Resident</button>
      </div>

      <hr />

      <ul>
        {residents.map((r) => (
          <li key={r.resident_id}>
            {r.name} ({r.email}) – Plot: {r.plot_no} {r.flat_no && `| Flat: ${r.flat_no}`}
            <button onClick={() => handleDeleteResident(r.resident_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResidentsManagement;
