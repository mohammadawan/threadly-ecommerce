import api from './axiosInstance';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/myorders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const payOrder = (id, data) => api.put(`/orders/${id}/pay`, data);
export const getAllOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const getAnalytics = (days) => api.get('/orders/analytics', { params: { days } });
