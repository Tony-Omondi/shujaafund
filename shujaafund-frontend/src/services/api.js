import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => API.post('/accounts/register/', data);
export const login = (data) => API.post('/token/', data);
export const getProfile = () => API.get('/accounts/profile/');
export const updateProfile = (data) => API.put('/accounts/profile/', data);
export const createFundraiser = (data) => API.post('/fundraisers/create/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getFundraiser = (id) => API.get(`/fundraisers/${id}/`);
export const exploreFundraisers = (params) => API.get('/fundraisers/explore/', { params });
export const getDashboard = () => API.get('/fundraisers/dashboard/');
export const initiatePayment = (data) => API.post('/payments/initiate/', data);
export const getHomeData = () => API.get('/core/');
export const getAbout = () => API.get('/core/about/');
export const getTermsPrivacy = () => API.get('/core/');
export const submitFeedback = (data) => API.post('/core/feedback/');
export const getCategories = () => API.get('/core/categories/');
export const getAdminDashboard = () => API.post('/core/admin/');

export default API;