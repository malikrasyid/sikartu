import axios from 'axios';

// 1. Create a base instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an "Interceptor" to attach the Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // We assume token is stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;