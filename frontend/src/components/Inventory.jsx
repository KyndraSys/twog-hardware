import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../utils/api';

function Inventory() {
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
        setError('Failed to load inventory. Check backend or try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 mr-2 rounded hover:bg-blue-700">Add Product</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 mr-2 rounded hover:bg-gray-300">Export CSV</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Print Report</button>
        </div>
      </div>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <div className="mb-6 flex space-x-4">
            <input type="text" placeholder="Search..." className="border p-2 rounded w-1/3" />
            <select className="border p-2 rounded">
              <option>All Categories</option>
              <option>Locks</option>
              <option>Padlocks</option>
              <option>Hardware & Tools</option>
              <option>Fasteners</option>
              <option>Specialized Tools</option>
            </select>
            <select className="border p-2 rounded">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Clear Filters</button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 text-left">Product Name</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Min Stock</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.product_id}>
                    <td className="border p-2">{product.product_code}</td>
                    <td className="border p-2">{product.product_name}</td>
                    <td className="border p-2">{product.category_name}</td>
                    <td className="border p-2">{product.quantity_in_stock}</td>
                    <td className="border p-2">{product.reorder_level}</td>
                    <td className="border p-2">KES {product.unit_price}</td>
                    <td className="border p-2">{product.status}</td>
                    <td className="border p-2">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border p-2" colSpan="8">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Inventory;