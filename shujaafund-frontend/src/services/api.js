// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('accessToken', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// API functions for all pages
export const register = (data) => api.post('accounts/register/', data);
export const login = (data) => api.post('accounts/login/', data);
export const getProfile = () => api.get('accounts/profile/');
export const updateProfile = (data) => api.put('accounts/profile/', data);
export const createFundraiser = (data) => api.post('fundraisers/create/', data);
export const getFundraiser = (id) => api.get(`fundraisers/${id}/`);
export const exploreFundraisers = (params) => api.get('fundraisers/explore/', { params });
export const getUserDashboard = () => api.get('fundraisers/dashboard/');
export const initiatePayment = (data) => api.post('payments/initiate/', data);
export const getHomeData = () => api.get('core/');
export const getAboutData = () => api.get('core/about/');
export const getTermsPrivacy = () => api.get('core/terms-privacy/');
export const getAdminDashboard = () => api.get('core/admin/');
export const submitFeedback = (data) => api.post('core/feedback/', data);

export default api;