import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Network Error');
  }
};

export const addProduct = async (product) => {
  try {
    const response = await api.post('/products', product);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to load categories');
  }
};

export const fetchSales = async (startDate = '', endDate = '') => {
  try {
    const response = await api.get('/sales', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw new Error('Failed to load sales');
  }
};

export const exportSalesData = async () => {
  try {
    const response = await api.get('/sales/export', { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Error exporting sales data:', error);
    throw new Error('Failed to export sales data');
  }
};

export const exportInventoryData = async () => {
  try {
    const response = await api.get('/inventory/export', { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Error exporting inventory data:', error);
    throw new Error('Failed to export inventory data');
  }
};

export const printInventoryReport = async () => {
  try {
    const response = await api.get('/inventory/report', { responseType: 'json' });
    return response.data;
  } catch (error) {
    console.error('Error generating inventory report:', error);
    throw new Error('Failed to generate inventory report');
  }
};