import React from 'react';

function SalesHistory() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Sales History</h1>
        <div>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 mr-2 rounded hover:bg-gray-300">Export CSV</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Print Report</button>
        </div>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="date"
          className="border p-2 rounded"
        />
        <input
          type="date"
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 mr-2 rounded hover:bg-blue-700">Filter</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Clear</button>
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
          <tr>
            <td className="border p-2" colSpan="7">No sales history</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;