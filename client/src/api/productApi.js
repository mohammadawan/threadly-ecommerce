import api from './axiosInstance';

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getLowStockProducts = () => api.get('/products/low-stock');

export const getProductReviews = (productId) => api.get(`/products/${productId}/reviews`);
export const createReview = (productId, data) => api.post(`/products/${productId}/reviews`, data);
export const deleteReview = (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`);
