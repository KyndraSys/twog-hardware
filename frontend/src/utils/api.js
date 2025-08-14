import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product-related API functions
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (data) => {
  try {
    const response = await api.post('/products', data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Category-related API functions
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (data) => {
  try {
    const response = await api.post('/categories', data);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Supplier-related API functions
export const fetchSuppliers = async () => {
  try {
    const response = await api.get('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const addSupplier = async (data) => {
  try {
    const response = await api.post('/suppliers', data);
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
};

export const updateSupplier = async (id, data) => {
  try {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};

// Sales-related API functions
export const fetchSales = async () => {
  try {
    const response = await api.get('/sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const fetchSaleById = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sale:', error);
    throw error;
  }
};

export const processSale = async (saleData) => {
  try {
    const response = await api.post('/sales', saleData);
    return response.data;
  } catch (error) {
    console.error('Error processing sale:', error);
    throw error;
  }
};

export const updateSale = async (id, data) => {
  try {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
};

export const deleteSale = async (id) => {
  try {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// Reports-related API functions
export const fetchSalesReport = async (startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/reports/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales report:', error);
    throw error;
  }
};

export const fetchInventoryReport = async () => {
  try {
    const response = await api.get('/reports/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    throw error;
  }
};

export const fetchProfitLossReport = async (startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/reports/profit-loss', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching profit/loss report:', error);
    throw error;
  }
};

// Stock movement functions
export const addStock = async (productId, quantity, notes = '') => {
  try {
    const response = await api.post(`/products/${productId}/stock/add`, {
      quantity,
      notes
    });
    return response.data;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

export const removeStock = async (productId, quantity, notes = '') => {
  try {
    const response = await api.post(`/products/${productId}/stock/remove`, {
      quantity,
      notes
    });
    return response.data;
  } catch (error) {
    console.error('Error removing stock:', error);
    throw error;
  }
};

// Search and filter functions
export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getLowStockProducts = async (threshold = 10) => {
  try {
    const response = await api.get('/products/low-stock', {
      params: { threshold }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw error;
  }
};

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// User/Auth functions (if needed)
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Backup and restore functions
export const exportData = async () => {
  try {
    const response = await api.get('/backup/export', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const importData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/backup/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Settings functions
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settings) => {
  try {
    const response = await api.put('/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export default api;