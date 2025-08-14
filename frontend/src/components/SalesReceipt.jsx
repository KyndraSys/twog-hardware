import React from 'react';

function SaleReceipt({ onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sale Receipt</h2>
        <div className="space-y-4">
          <p>No receipt data available</p>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaleReceipt;