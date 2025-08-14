import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import { fetchProducts } from '../utils/api'; // Import API function

function Dashboard() {
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state
        const data = await fetchProducts(); // Fetch from API
        setProducts(data); // Update state with fetched data
      } catch (err) {
        setError('Failed to load data. Check backend or try again later.'); // Handle error
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    fetchData();
  }, []); // Empty dependency array for mount only

  // Calculate stats based on products (fallback to 0 if no data)
  const totalProducts = products.length || 0;
  const totalAssetValue = products.reduce((sum, p) => sum + (p.quantity_in_stock * p.unit_price || 0), 0) || 0;
  const lowStockItems = products.filter(p => p.quantity_in_stock > 0 && p.quantity_in_stock <= p.reorder_level || 0).length || 0;
  const outOfStock = products.filter(p => p.quantity_in_stock === 0 || 0).length || 0;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Total Products</p>
              <p className="text-xl font-bold">{totalProducts}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Total Asset Value</p>
              <p className="text-xl font-bold">KES {totalAssetValue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Low Stock Items</p>
              <p className="text-xl font-bold">{lowStockItems}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Out of Stock</p>
              <p className="text-xl font-bold">{outOfStock}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Sales</h2>
            <button className="text-blue-600 hover:underline mb-2">View All Sales</button>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Sale ID</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Items</th>
                  <th className="border p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2" colSpan="4">No recent sales</td>
                </tr>
                {/* TODO: Fetch and map sales data from /api/sales */}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Inventory Overview</h2>
            <button className="text-blue-600 hover:underline mb-2">View All</button>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Product Name</th>
                  <th className="border p-2 text-left">Category</th>
                  <th className="border p-2 text-left">Stock</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.product_id}>
                      <td className="border p-2">{product.product_name}</td>
                      <td className="border p-2">{product.category_name}</td>
                      <td className="border p-2">{product.quantity_in_stock}</td>
                      <td className="border p-2">{product.status}</td>
                      <td className="border p-2">KES {product.unit_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border p-2" colSpan="5">No inventory data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;