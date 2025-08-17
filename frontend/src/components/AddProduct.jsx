import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { X, Save, Package, AlertCircle, Sparkles } from 'lucide-react';


const API_BASE = 'http://localhost:5000/api';

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
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/suppliers`);
      setSuppliers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setErrors({ submit: 'Failed to load suppliers.' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setErrors({ submit: 'Failed to load categories.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_code.trim()) newErrors.product_code = 'Product code is required';
    if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.unit_price || formData.unit_price <= 0) newErrors.unit_price = 'Valid unit price is required';
    if (!formData.quantity_in_stock || formData.quantity_in_stock < 0) newErrors.quantity_in_stock = 'Valid quantity is required';
    if (!formData.reorder_level || formData.reorder_level < 0) newErrors.reorder_level = 'Valid reorder level is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        product_code: formData.product_code,
        product_name: formData.product_name,
        category_id: parseInt(formData.category_id),
        supplier_id: parseInt(formData.supplier_id),
        unit_price: parseFloat(formData.unit_price),
        quantity_in_stock: parseInt(formData.quantity_in_stock),
        reorder_level: parseInt(formData.reorder_level),
        status: 'In Stock'
      };

      await axios.post(`${API_BASE}/products`, productData);
      alert('Product added successfully!');
      window.history.back();
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      setErrors({ submit: 'Failed to add product. Check backend or try again.' });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, children, className = "", ...props }) => (
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
            value={formData[name] || ''} // Ensure value is a string
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField('')}
            className={`
              w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none
              hover:border-gray-400
              ${errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}
              ${focusedField === name ? 'transform scale-[1.02]' : ''}
              ${className}
            `}
            placeholder={placeholder}
            {...props}
          />
        )}
        {errors[name] && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs animate-pulse">
            <AlertCircle className="h-3 w-3" />
            <span>{errors[name]}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out scale-100" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)' }}>
        <div className="relative px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new product to your inventory</p>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute top-0 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-8 right-32 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-2xl"></div>
        </div>

        {errors.submit && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} id="add-product-form" className="p-8 space-y-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Product Code"
              name="product_code"
              placeholder="e.g., LCK001"
            />
            <InputField
              label="Product Name"
              name="product_name"
              placeholder="e.g., Moment Locks"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Category" name="category_id">
              <select
                name="category_id"
                value={formData.category_id || ''} // Ensure value is a string
                onChange={handleChange}
                onFocus={() => setFocusedField('category_id')}
                onBlur={() => setFocusedField('')}
                className={`
                  w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
                  focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none
                  hover:border-gray-400 cursor-pointer
                  ${errors.category_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}
                  ${focusedField === 'category_id' ? 'transform scale-[1.02]' : ''}
                `}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Supplier" name="supplier_id">
              <select
                name="supplier_id"
                value={formData.supplier_id || ''} // Ensure value is a string
                onChange={handleChange}
                onFocus={() => setFocusedField('supplier_id')}
                onBlur={() => setFocusedField('')}
                className={`
                  w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
                  focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none
                  hover:border-gray-400 cursor-pointer
                  ${errors.supplier_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}
                  ${focusedField === 'supplier_id' ? 'transform scale-[1.02]' : ''}
                `}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </InputField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Unit Price (KES)"
              name="unit_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
            <InputField
              label="Initial Stock"
              name="quantity_in_stock"
              type="number"
              min="0"
              placeholder="0"
            />
            <InputField
              label="Reorder Level"
              name="reorder_level"
              type="number"
              min="0"
              placeholder="5"
            />
          </div>
        </form>

        <div className="px-8 py-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={loading}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-product-form"
              disabled={loading}
              className={`
                px-8 py-3 text-sm font-semibold text-white rounded-xl
                bg-gradient-to-r from-blue-500 to-purple-600 
                hover:from-blue-600 hover:to-purple-700
                focus:ring-4 focus:ring-blue-200
                transform transition-all duration-200
                hover:scale-105 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center space-x-2
              `}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}