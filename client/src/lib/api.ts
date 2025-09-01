import { apiRequest } from './queryClient';

const API_BASE = '/api';

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest('POST', `${API_BASE}/login`, { email, password }),
  
  adminLogin: (email: string, password: string, securityKey: string) =>
    apiRequest('POST', `${API_BASE}/admin/login`, { email, password, securityKey }),
  
  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiRequest('POST', `${API_BASE}/register`, { email, passwordHash: password, firstName, lastName }),

  // Products
  getProducts: (params?: { search?: string; category?: string; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);
    return fetch(`${API_BASE}/products?${searchParams}`);
  },

  getFeaturedProducts: () => fetch(`${API_BASE}/products/featured`),
  
  getProduct: (id: string) => fetch(`${API_BASE}/products/${id}`),

  // Orders
  createOrder: (orderData: any, token: string) =>
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    }),

  getUserOrders: (userId: string, token: string) =>
    fetch(`${API_BASE}/users/${userId}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Reviews
  getProductReviews: (productId: string) =>
    fetch(`${API_BASE}/products/${productId}/reviews`),

  createReview: (productId: string, review: any, token: string) =>
    fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(review)
    }),

  // Wishlist
  getUserWishlist: (userId: string, token: string) =>
    fetch(`${API_BASE}/users/${userId}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addToWishlist: (productId: string, token: string) =>
    fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    }),

  removeFromWishlist: (productId: string, token: string) =>
    fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }),

  // Admin
  getAllOrders: (token: string) =>
    fetch(`${API_BASE}/orders/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateOrderStatus: (orderId: string, status: string, token: string) =>
    fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  createProduct: (product: any, token: string) =>
    fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    }),

  updateProduct: (id: string, product: any, token: string) =>
    fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    }),

  deleteProduct: (id: string, token: string) =>
    fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }),

  // Main admin only
  getAllUsers: (token: string) =>
    fetch(`${API_BASE}/users/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  deleteUser: (id: string, token: string) =>
    fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }),

  updateUserRole: (id: string, adminRole: string, token: string) =>
    fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ adminRole })
    }),

  createStandardAdmin: (email: string, password: string, securityKey: string, token: string) =>
    fetch(`${API_BASE}/admin/create-standard-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, password, securityKey })
    }),

  getRevenueStats: (token: string) =>
    fetch(`${API_BASE}/reports/revenue`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getTopProducts: (token: string) =>
    fetch(`${API_BASE}/reports/top-products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  downloadProducts: (token: string) =>
    fetch(`${API_BASE}/reports/products/download`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getAdminActivityLog: (token: string) =>
    fetch(`${API_BASE}/admin/activity-log`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};
