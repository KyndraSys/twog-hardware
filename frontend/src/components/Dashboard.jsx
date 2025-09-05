import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { fetchProducts, exportSalesData } from '../utils/api';

function Dashboard() { // Removed setCurrentView prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load data. Check backend or try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats based on products
  const totalProducts = products.length || 0;
  const totalAssetValue = products.reduce((sum, p) => sum + (p.quantity_in_stock * p.unit_price || 0), 0) || 0;
  const lowStockItems = products.filter(p => p.quantity_in_stock > 0 && p.quantity_in_stock <= p.reorder_level).length || 0;
  const outOfStock = products.filter(p => p.quantity_in_stock === 0).length || 0;

  // Get recent products for preview
  const recentProducts = products.slice(0, 5);

  const StatCard = ({ title, value, change, changeType, icon, color = "slate" }) => (
    <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 group cursor-pointer">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 ${
            color === 'slate' ? 'bg-slate-100 text-slate-600' : 
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
            color === 'orange' ? 'bg-orange-50 text-orange-600' : 
            'bg-red-50 text-red-600'
          } flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          {change && (
            <div className={`text-xs font-medium ${
              changeType === 'positive' ? 'text-emerald-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-slate-500'
            }`}>
              {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
            {value}
          </h3>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  const handleExportCSV = async () => {
    try {
      const csvData = await exportSalesData();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export data. Check backend connection.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium text-sm">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white border border-red-200 p-8 max-w-md">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to Load Dashboard</h3>
                <p className="text-slate-600 text-sm mb-4">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
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
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 text-sm">Monitor your business performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleExportCSV}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Sales</span>
              </button>
              <Link 
                to="/inventory"
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                Quick Actions
              </Link>
            </div>
          </div>
        </div>
      </div>


 {/* Action Grid */}
        <div className="bg-white border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <p className="text-slate-500 text-sm">Common business operations</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/pos"
                className="p-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">New Sale</span>
                </div>
              </Link>
              
              <Link 
                to="/add-product"
                className="p-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Add Product</span>
                </div>
              </Link>
              
              <Link 
                to="/reports"
                className="p-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">View Reports</span>
                </div>
              </Link>
              
              <Link 
                to="/settings"
                className="p-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Settings</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={totalProducts.toLocaleString()}
            change="+12%"
            changeType="positive"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
            color="slate"
          />
          <StatCard
            title="Asset Value"
            value={`KES ${totalAssetValue.toLocaleString()}`}
            change="+8.2%"
            changeType="positive"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />}
            color="emerald"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems.toString()}
            change={lowStockItems > 0 ? "Attention needed" : "All good"}
            changeType={lowStockItems > 0 ? "negative" : "positive"}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />}
            color="orange"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStock.toString()}
            change={outOfStock > 0 ? "Restock needed" : "All stocked"}
            changeType={outOfStock > 0 ? "negative" : "positive"}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 12M6 6l12 12" />}
            color="red"
          />
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Top Products</h2>
                  <p className="text-slate-500 text-sm">Highest value inventory</p>
                </div>
                <Link 
                  to="/inventory"
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProducts.length > 0 ? (
                    recentProducts.map((product, index) => (
                      <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              product.quantity_in_stock === 0 ? 'bg-red-500' :
                              product.quantity_in_stock <= product.reorder_level ? 'bg-orange-500' :
                              'bg-emerald-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{product.product_name}</p>
                              <p className="text-xs text-slate-500">{product.category_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {product.quantity_in_stock}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          KES {product.unit_price}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                            product.quantity_in_stock === 0 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : product.quantity_in_stock <= product.reorder_level 
                                ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {product.quantity_in_stock === 0 
                              ? 'Out of Stock' 
                              : product.quantity_in_stock <= product.reorder_level 
                                ? 'Low Stock' 
                                : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-12 text-center text-slate-500" colSpan="4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 bg-slate-100 text-slate-400 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">No products found</p>
                            <p className="text-xs text-slate-500">Add products to see inventory</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent Sales</h2>
                  <p className="text-slate-500 text-sm">Latest transactions</p>
                </div>
                <Link 
                  to="/sales"
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Sale ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-12 text-center text-slate-500" colSpan="4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 bg-slate-100 text-slate-400 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-700">No recent sales</p>
                          <p className="text-xs text-slate-500">Sales data will appear here</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Sales Overview */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Sales Overview</h2>
                  <p className="text-slate-500 text-sm">Performance trends</p>
                </div>
                <Link 
                  to="/sales"
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="font-medium text-slate-700">Sales Analytics</p>
                  <p className="text-xs text-slate-500 mt-1">Connect data source to view insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Distribution */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Inventory Distribution</h2>
                  <p className="text-slate-500 text-sm">Category breakdown</p>
                </div>
                <Link 
                  to="/inventory"
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium hover:underline"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <p className="font-medium text-slate-700">Distribution Chart</p>
                  <p className="text-xs text-slate-500 mt-1">Visual category breakdown</p>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default Dashboard;