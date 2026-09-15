import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crust_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crust_token');
      localStorage.removeItem('crust_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verifyEmail: (token) => API.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  getMe: () => API.get('/auth/me'),
};

export const pizzaAPI = {
  getAll: () => API.get('/pizzas'),
  getOne: (id) => API.get(`/pizzas/${id}`),
};

export const inventoryAPI = {
  getAll: (category) => API.get('/inventory', { params: category ? { category } : {} }),
  update: (id, data) => API.patch(`/inventory/${id}`, data),
  create: (data) => API.post('/inventory', data),
  delete: (id) => API.delete(`/inventory/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getAll: () => API.get('/orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  updatePayment: (data) => API.post('/orders/update-payment', data),
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payments/create-order', data),
  verify: (data) => API.post('/payments/verify', data),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getOrders: () => API.get('/admin/orders'),
  getOrder: (id) => API.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => API.patch(`/admin/orders/${id}/status`, data),
  getInventory: () => API.get('/admin/inventory'),
  updateStock: (id, data) => API.patch(`/admin/inventory/${id}`, data),
  getLowStock: () => API.get('/admin/low-stock'),
};

export default API;
