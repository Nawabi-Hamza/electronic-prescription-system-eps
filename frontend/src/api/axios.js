import axios from 'axios';
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with your API base URL
const api = axios.create({
  baseURL: `${API_URL}/v1`, // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or wherever you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // (error) => console.log(error)
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: logout user if unauthorized
    // console.log(error)
    if ((error.response && error.response.status === 401) || error.response.status === 403) {
      // handle logout, redirect, or show message
      localStorage.removeItem('token');
      window.location.href = '/login'; // or use React Router redirect
    }
    return Promise.reject(error);
  }
);

export const apiURL = `${API_URL}/v1`


export default api;
