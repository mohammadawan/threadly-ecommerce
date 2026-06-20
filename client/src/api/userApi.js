import api from './axiosInstance';

export const getUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
