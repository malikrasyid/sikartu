import api from './api';

// GET: Fetch all data
export const getPerkara = async () => {
  const response = await api.get('/perkara');
  return response.data;
};

// GET: Fetch SINGLE Perkara by ID (For the Detail Modal/Page)
export const getPerkaraById = async (id) => {
    const response = await api.get(`/perkara/${id}`);
    return response.data;
  };

// POST: Create new (Need to handle FormData for file upload)
export const createPerkara = async (formData) => {
  // Note: Content-Type 'multipart/form-data' is handled automatically by axios when passing FormData
  const response = await api.post('/perkara', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// PATCH: Update status only
export const updateStatus = async (id, newStatus) => {
  const response = await api.patch(`/perkara/${id}/status`, {
    status_perkara: newStatus
  });
  return response.data;
};

// DELETE: Remove a case
export const deletePerkara = async (id) => {
  const response = await api.delete(`/perkara/${id}`);
  return response.data;
};