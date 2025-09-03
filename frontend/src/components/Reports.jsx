import React from 'react';

function Reports() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Reports</h1>
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <label>Report Period:</label>
          <input type="date" className="border p-2 rounded" />
          <span>to</span>
          <input type="date" className="border p-2 rounded" />
        </div>
        <select className="border p-2 rounded mb-4">
          <option>Sales Report</option>
          <option>Inventory Report</option>
          <option>Low Stock Report</option>
          <option>Financial Summary</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generate Report</button>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Sales Analytics</h2>
        <p className="text-gray-600">Generate a report to view sales analytics and charts</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Sales Today</p>
            <p className="text-xl font-bold">0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Revenue Today</p>
            <p className="text-xl font-bold">KES 0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Avg Sale Value</p>
            <p className="text-xl font-bold">KES 0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Top Selling Product</p>
            <p className="text-xl font-bold">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;