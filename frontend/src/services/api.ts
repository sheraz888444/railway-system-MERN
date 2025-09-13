import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Trains API
export const trainsAPI = {
  getAllTrains: async (params?: { source?: string; destination?: string; date?: string }) => {
    const response = await api.get('/trains', { params });
    return response.data;
  },

  getTrainById: async (id: string) => {
    const response = await api.get(`/trains/${id}`);
    return response.data;
  },

  createTrain: async (trainData: any) => {
    const response = await api.post('/trains', trainData);
    return response.data;
  },

  updateTrain: async (id: string, trainData: any) => {
    const response = await api.put(`/trains/${id}`, trainData);
    return response.data;
  },

  deleteTrain: async (id: string) => {
    const response = await api.delete(`/trains/${id}`);
    return response.data;
  },

  getAvailableSeats: async (id: string) => {
    const response = await api.get(`/trains/${id}/seats`);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData: {
    trainId: string;
    passengers: any[];
    journeyDate: string;
  }) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingByPNR: async (pnr: string) => {
    const response = await api.get(`/bookings/pnr/${pnr}`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getPassengerStats: async () => {
    const response = await api.get('/dashboard/passenger');
    return response.data;
  },

  getStaffStats: async () => {
    const response = await api.get('/dashboard/staff');
    return response.data;
  },
};

export default api;
