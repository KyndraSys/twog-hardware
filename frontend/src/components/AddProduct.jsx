import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { X, Save, Package, AlertCircle, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const InputField = ({ label, name, type = "text", placeholder, children, value, onChange, error }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
      {label}
      <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      {children || (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none border-gray-200 bg-gray-50 focus:bg-white ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  </div>
);

export default function AddProduct() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category_id: '',
    supplier_id: '',
    unit_price: '',
    quantity_in_stock: '',
    reorder_level: ''
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [codeError, setCodeError] = useState(null);

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/suppliers`);
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load suppliers.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories.');
    }
  };

  const checkProductCode = async (code) => {
    if (!code) {
      setCodeError(null);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/products/check-code?code=${encodeURIComponent(code)}`);
      if (response.data.exists) {
        setCodeError('Product code already exists');
      } else {
        setCodeError(null);
      }
    } catch (err) {
      console.error('Error checking product code:', err);
      setCodeError('Failed to validate product code');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'product_code') {
      checkProductCode(value);
    }
  };

  const handleSubmit = async () => {
    if (!formData.product_code || !formData.product_name || !formData.category_id || !formData.supplier_id || !formData.unit_price) {
      setError('Product code, name, category, supplier, and price are required.');
      return;
    }
    if (codeError) {
      setError('Please fix the product code error before submitting.');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        product_code: formData.product_code,
        product_name: formData.product_name,
        category_id: parseInt(formData.category_id),
        supplier_id: parseInt(formData.supplier_id),
        unit_price: parseFloat(formData.unit_price),
        quantity_in_stock: parseInt(formData.quantity_in_stock) || 0,
        reorder_level: parseInt(formData.reorder_level) || 0,
      };

      await axios.post(`${API_BASE}/products`, productData);
      alert('Product added successfully!');
      window.history.back();
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      if (err.response?.data?.message?.includes('Product code')) {
        setCodeError(err.response.data.message);
        setError('Please fix the product code error.');
      } else {
        setError(err.response?.data?.message || 'Failed to add product. Check backend or try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Product</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Product Code"
            name="product_code"
            placeholder="e.g., LCK001"
            value={formData.product_code}
            onChange={handleChange}
            error={codeError}
          />
          <InputField
            label="Product Name"
            name="product_name"
            placeholder="e.g., Moment Locks"
            value={formData.product_name}
            onChange={handleChange}
          />
          
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none border-gray-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none border-gray-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
          </div>
          
          <InputField
            label="Unit Price (KES)"
            name="unit_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.unit_price}
            onChange={handleChange}
          />
          
          <InputField
            label="Initial Stock"
            name="quantity_in_stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.quantity_in_stock}
            onChange={handleChange}
          />
        </div>
        
        <div className="mt-4">
          <InputField
            label="Reorder Level"
            name="reorder_level"
            type="number"
            min="0"
            placeholder="5"
            value={formData.reorder_level}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading || codeError}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}