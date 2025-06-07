import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StreetsManagement = () => {
  const org_id = 1; // Set your org ID dynamically later
  const [streets, setStreets] = useState([]);
  const [newStreet, setNewStreet] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchStreets = async () => {
    try {
      const res = await axios.get(`/api/admin/streets/${org_id}`);
      setStreets(res.data);
    } catch (err) {
      console.error('Failed to load streets', err);
    }
  };

  const addStreet = async () => {
    if (!newStreet.trim()) return;
    try {
      await axios.post('/api/admin/streets', { org_id, street_name: newStreet });
      setNewStreet('');
      fetchStreets();
    } catch (err) {
      console.error('Failed to add street', err);
    }
  };

  const updateStreet = async (id) => {
    try {
      await axios.put(`/api/admin/streets/${id}`, { street_name: editName });
      setEditing(null);
      setEditName('');
      fetchStreets();
    } catch (err) {
      console.error('Failed to update street', err);
    }
  };

  const deleteStreet = async (id) => {
    try {
      await axios.delete(`/api/admin/streets/${id}`);
      fetchStreets();
    } catch (err) {
      console.error('Failed to delete street', err);
    }
  };

  useEffect(() => {
    fetchStreets();
  }, []);

  return (
    <div>
      <h3>Manage Streets</h3>

      <div>
        <input
          value={newStreet}
          onChange={(e) => setNewStreet(e.target.value)}
          placeholder="Enter street name"
        />
        <button onClick={addStreet}>Add Street</button>
      </div>

      <ul>
        {streets.map((street) => (
          <li key={street.street_id}>
            {editing === street.street_id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => updateStreet(street.street_id)}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                {street.street_name}
                <button onClick={() => {
                  setEditing(street.street_id);
                  setEditName(street.street_name);
                }}>Edit</button>
                <button onClick={() => deleteStreet(street.street_id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreetsManagement;
