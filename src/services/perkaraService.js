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
  const response = await api.post('/perkara', formData);
  return response.data;
};

// PUT: Update ALL fields (including file)
export const updatePerkara = async (id, formData) => {
  const response = await api.put(`/perkara/${id}`, formData);
  return response.data;
};

// DELETE: Remove a case
export const deletePerkara = async (id) => {
  const response = await api.delete(`/perkara/${id}`);
  return response.data;
};