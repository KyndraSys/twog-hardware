import React from 'react';

function AddProduct({ onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Code"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Product Name"
            className="border p-2 w-full rounded"
          />
          <select className="border p-2 w-full rounded">
            <option>Locks</option>
            <option>Padlocks</option>
            <option>Hardware & Tools</option>
            <option>Fasteners</option>
            <option>Specialized Tools</option>
          </select>
          <input
            type="number"
            placeholder="Current Stock"
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Minimum Stock Level"
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Unit Price (KES)"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Supplier"
            className="border p-2 w-full rounded"
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;