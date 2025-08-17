import React, { useState, useEffect } from 'react';
import { X, Save, Package, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function EditProduct() {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    product_code: '',
    product_name: '',
    category_id: '',
    supplier_id: '',
    unit_price: '',
    quantity_in_stock: '',
    reorder_level: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchSuppliers();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products/${id}`);
      const product = response.data;
      setProductData({
        product_code: product.product_code,
        product_name: product.product_name,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        unit_price: product.unit_price,
        quantity_in_stock: product.quantity_in_stock,
        reorder_level: product.reorder_level
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details.');
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!productData.product_name || !productData.category_id || !productData.supplier_id || !productData.unit_price) {
      setError('Name, category ID, supplier ID, and price are required.');
      return;
    }
    setLoading(true);
    try {
      const dataToSave = {
        product_code: productData.product_code,
        product_name: productData.product_name,
        category_id: parseInt(productData.category_id),
        supplier_id: parseInt(productData.supplier_id),
        unit_price: parseFloat(productData.unit_price),
        quantity_in_stock: parseInt(productData.quantity_in_stock),
        reorder_level: parseInt(productData.reorder_level)
      };
      await axios.put(`${API_BASE}/products/${id}`, dataToSave);
      alert('Product updated successfully!');
      window.history.back(); // Navigate back to Inventory
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const InputField = ({ label, name, type = "text", placeholder, children, className = "" }) => (
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
            value={productData[name]}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}
            `}
            placeholder={placeholder}
          />
        )}
        {error && name === 'submit' && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs animate-pulse">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Product</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="space-y-4">
          <InputField
            label="Product Code"
            name="product_code"
            placeholder="Product Code"
            readOnly
          />
          <InputField
            label="Product Name"
            name="product_name"
            placeholder="Product Name"
            required
          />
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none border-gray-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier_id"
              value={productData.supplier_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none border-gray-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(sup => (
                <option key={sup.supplier_id} value={sup.supplier_id}>{sup.supplier_name}</option>
              ))}
            </select>
          </div>
          <InputField
            label="Current Stock"
            name="quantity_in_stock"
            type="number"
            min="0"
            placeholder="Current Stock"
          />
          <InputField
            label="Minimum Stock Level"
            name="reorder_level"
            type="number"
            min="0"
            placeholder="Minimum Stock Level"
          />
          <InputField
            label="Unit Price (KES)"
            name="unit_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Unit Price"
            required
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;