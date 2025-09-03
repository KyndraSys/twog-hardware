import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../utils/api';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProducts();
        console.log('Fetched products:', productData);
        setProducts(productData);
      } catch (err) {
        setError('Failed to load products. Check backend or try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.product_id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity_in_stock) {
        setCart(cart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert(`Cannot add more than ${product.quantity_in_stock} available!`);
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, item.quantity_in_stock)) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0).toFixed(2);
  };

  const calculateTax = (subtotal) => {
    return (subtotal * 0.16).toFixed(2); // 16% tax
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax(subtotal));
    return (subtotal + tax).toFixed(2);
  };

 const handleCheckout = async () => {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  try {
    const saleData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      total_amount: parseFloat(calculateTotal()),  // Changed back to total_amount
      tax_amount: parseFloat(calculateTax(calculateSubtotal())), // Changed back to tax_amount
      sale_date: new Date().toISOString()
    };

    console.log('Sale data being sent:', JSON.stringify(saleData, null, 2));
    await axios.post(`${API_BASE}/sales`, saleData);
    alert('Sale completed successfully!');
    setCart([]);
    const updatedProducts = await fetchProducts();
    setProducts(updatedProducts);
  } catch (err) {
    console.error('Full error response:', err.response);
    console.error('Error data:', err.response?.data);
    setError('Failed to process sale. Check backend.');
  }
};

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockIndicator = (stock, reorderLevel) => {
    if (stock === 0) return { color: 'bg-red-500', label: 'Out' };
    if (stock <= reorderLevel) return { color: 'bg-orange-500', label: 'Low' };
    return { color: 'bg-emerald-500', label: 'In' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-96">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md">
            <div className="text-center">
              <div className="text-red-600 text-4xl mb-4">⚠</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Point of Sale</h1>
                <p className="text-slate-600 text-sm mt-1">Process in-store sales efficiently</p>
              </div>
            </div>
            <Link
              to="/inventory"
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Back to Inventory</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockIndicator = getStockIndicator(product.quantity_in_stock, product.reorder_level);
                    return (
                      <div
                        key={product.product_id}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => addToCart(product)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${stockIndicator.color}`}></div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{product.product_name}</p>
                            <p className="text-xs text-slate-600">{product.product_code}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 mt-2">KES {product.unit_price}</p>
                        <p className="text-xs text-slate-500">Stock: {product.quantity_in_stock} ({stockIndicator.label})</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-500">
                    No products available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13l2.5 5M9 19.5h.01M20 19.5h.01" />
              </svg>
              <span>Cart ({cart.length} items)</span>
            </h2>
            {cart.length > 0 ? (
              <>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between border-b border-slate-200 py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.product_name}</p>
                        <p className="text-xs text-slate-600">KES {item.unit_price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product_id, -1);
                          }}
                          className="px-2 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product_id, 1);
                          }}
                          className="px-2 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.product_id);
                          }}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm font-medium">
                  <p>Subtotal: KES {calculateSubtotal()}</p>
                  <p>Tax (16%): KES {calculateTax(calculateSubtotal())}</p>
                  <p className="text-lg font-semibold text-slate-900">Total: KES {calculateTotal()}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Process Sale</span>
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Cart is empty
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointOfSale;