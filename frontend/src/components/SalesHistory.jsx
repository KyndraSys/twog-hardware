import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSales } from '../utils/api';

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const salesData = await fetchSales(startDate, endDate);
        console.log('Fetched sales:', salesData); // Debug log
        setSales(Array.isArray(salesData) ? salesData : []);
      } catch (err) {
        setError('Failed to load sales history. Check backend or try again.');
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const handleFilter = () => {
    setLoading(true); // Trigger refetch
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setLoading(true); // Trigger refetch
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded">
        <p className="text-gray-600">Loading sales history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-600 text-white px-2 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Sales History</h1>
        <div>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 mr-2 rounded">Export CSV</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Print Report</button>
        </div>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 mr-2 rounded"
        >
          Filter
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Sale ID</th>
            <th className="border p-2 text-left">Date & Time</th>
            <th className="border p-2 text-left">Items</th>
            <th className="border p-2 text-left">Subtotal</th>
            <th className="border p-2 text-left">Tax</th>
            <th className="border p-2 text-left">Total</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.sale_id}>
                <td className="border p-2">{sale.sale_id || 'N/A'}</td>
                <td className="border p-2">{sale.sale_date ? formatDateTime(sale.sale_date) : 'N/A'}</td>
                <td className="border p-2">{sale.items?.map(item => `${item.product_name || 'N/A'} (x${item.quantity || 0})`).join(', ') || 'N/A'}</td>
                <td className="border p-2">KES {sale.subtotal || 0}</td>
                <td className="border p-2">KES {sale.tax || 0}</td>
                <td className="border p-2">KES {sale.total || 0}</td>
                <td className="border p-2">
                  <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2" colSpan="7">No sales history</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;