import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Admin JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cyberclub_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Stations API
export const fetchAllStations = async () => {
  const res = await api.get('/stations');
  return res.data;
};

export const fetchStationsByType = async (type) => {
  const res = await api.get(`/stations/type/${type}`);
  return res.data;
};

export const fetchStationById = async (id) => {
  const res = await api.get(`/stations/${id}`);
  return res.data;
};

export const patchStationStatus = async (id, status) => {
  const res = await api.patch(`/stations/${id}/status`, { status });
  return res.data;
};

// Bookings API
export const apiCalculatePricing = async ({ stationIds, stationType, stationCount, requestedHours }) => {
  const res = await api.post('/bookings/pricing-summary', {
    stationIds,
    stationType,
    stationCount,
    requestedHours,
  });
  return res.data;
};

export const apiCheckAvailability = async ({ stationIds, startTime, requestedHours }) => {
  const res = await api.post('/bookings/check-availability', {
    stationIds,
    startTime,
    requestedHours,
  });
  return res.data;
};

export const apiCreateBooking = async (bookingData) => {
  const res = await api.post('/bookings/create', bookingData);
  return res.data;
};

export const apiGetBookingByCode = async (code) => {
  const res = await api.get(`/bookings/code/${code}`);
  return res.data;
};

export const apiCancelBooking = async (id) => {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
};

export const apiGetAllBookings = async (params = {}) => {
  const res = await api.get('/bookings', { params });
  return res.data;
};

// Games API
export const fetchGames = async (params = {}) => {
  const res = await api.get('/games', { params });
  return res.data;
};

export const fetchGameCategories = async () => {
  const res = await api.get('/games/categories');
  return res.data;
};

// Admin API
export const apiAdminLogin = async (username, password) => {
  const res = await api.post('/admin/login', { username, password });
  return res.data;
};

export const fetchDashboardStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const apiToggleMaintenance = async (id) => {
  const res = await api.patch(`/admin/stations/${id}/maintenance`);
  return res.data;
};

export default api;
