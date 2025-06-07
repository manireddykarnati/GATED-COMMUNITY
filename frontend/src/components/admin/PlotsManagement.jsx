import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlotsManagement = () => {
  const org_id = 1;
  const [plots, setPlots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [newPlot, setNewPlot] = useState({ street_id: '', plot_no: '', plot_type: 'Individual' });
  const [expandedPlot, setExpandedPlot] = useState(null);
  const [flatInputs, setFlatInputs] = useState({});
  const [flats, setFlats] = useState({});

  const fetchPlots = async () => {
    const res = await axios.get(`/api/admin/plots/${org_id}`);
    setPlots(res.data);
  };

  const fetchStreets = async () => {
    const res = await axios.get(`/api/admin/streets/${org_id}`);
    setStreets(res.data);
  };

  const fetchFlats = async (plot_id) => {
    const res = await axios.get(`/api/admin/flats/${plot_id}`);
    setFlats((prev) => ({ ...prev, [plot_id]: res.data }));
  };

  const handleAddPlot = async () => {
    await axios.post('/api/admin/plots', { ...newPlot, org_id });
    setNewPlot({ street_id: '', plot_no: '', plot_type: 'Individual' });
    fetchPlots();
  };

  const handleDeletePlot = async (id) => {
    await axios.delete(`/api/admin/plots/${id}`);
    fetchPlots();
  };

  const handleAddFlat = async (plot_id) => {
    const { flat_no, eb_card } = flatInputs[plot_id] || {};
    if (!flat_no) return;
    await axios.post('/api/admin/flats', { plot_id, flat_no, eb_card });
    setFlatInputs((prev) => ({ ...prev, [plot_id]: { flat_no: '', eb_card: '' } }));
    fetchFlats(plot_id);
  };

  const handleDeleteFlat = async (flat_id, plot_id) => {
    await axios.delete(`/api/admin/flats/${flat_id}`);
    fetchFlats(plot_id);
  };

  useEffect(() => {
    fetchPlots();
    fetchStreets();
  }, []);

  return (
    <div>
      <h3>Plot and Flat Management</h3>

      <div>
        <select
          value={newPlot.street_id}
          onChange={(e) => setNewPlot({ ...newPlot, street_id: e.target.value })}
        >
          <option value="">Select Street</option>
          {streets.map((s) => (
            <option key={s.street_id} value={s.street_id}>
              {s.street_name}
            </option>
          ))}
        </select>
        <input
          placeholder="Plot No"
          value={newPlot.plot_no}
          onChange={(e) => setNewPlot({ ...newPlot, plot_no: e.target.value })}
        />
        <select
          value={newPlot.plot_type}
          onChange={(e) => setNewPlot({ ...newPlot, plot_type: e.target.value })}
        >
          <option value="Individual">Individual</option>
          <option value="Flats">Flats</option>
        </select>
        <button onClick={handleAddPlot}>Add Plot</button>
      </div>

      <hr />

      {plots.map((plot) => (
        <div key={plot.plot_id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{plot.plot_no}</strong> ({plot.plot_type}) - Street: {plot.street_name}
            </div>
            <div>
              <button onClick={() => handleDeletePlot(plot.plot_id)}>Delete Plot</button>
              {plot.plot_type === 'Flats' && (
                <button
                  onClick={() => {
                    setExpandedPlot((prev) => (prev === plot.plot_id ? null : plot.plot_id));
                    if (expandedPlot !== plot.plot_id) fetchFlats(plot.plot_id);
                  }}
                >
                  {expandedPlot === plot.plot_id ? 'Hide Flats' : 'Show Flats'}
                </button>
              )}
            </div>
          </div>

          {expandedPlot === plot.plot_id && (
            <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <h4>Flats</h4>
              {(flats[plot.plot_id] || []).map((flat) => (
                <div key={flat.flat_id} style={{ display: 'flex', gap: '10px' }}>
                  <span>{flat.flat_no} (EB: {flat.eb_card})</span>
                  <button onClick={() => handleDeleteFlat(flat.flat_id, plot.plot_id)}>Delete</button>
                </div>
              ))}
              <div style={{ marginTop: '10px' }}>
                <input
                  placeholder="Flat No"
                  value={flatInputs[plot.plot_id]?.flat_no || ''}
                  onChange={(e) =>
                    setFlatInputs((prev) => ({
                      ...prev,
                      [plot.plot_id]: {
                        ...prev[plot.plot_id],
                        flat_no: e.target.value
                      }
                    }))
                  }
                />
                <input
                  placeholder="EB Card"
                  value={flatInputs[plot.plot_id]?.eb_card || ''}
                  onChange={(e) =>
                    setFlatInputs((prev) => ({
                      ...prev,
                      [plot.plot_id]: {
                        ...prev[plot.plot_id],
                        eb_card: e.target.value
                      }
                    }))
                  }
                />
                <button onClick={() => handleAddFlat(plot.plot_id)}>Add Flat</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlotsManagement;
