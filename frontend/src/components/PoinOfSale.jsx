import React from 'react';

function PointOfSale() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Point of Sale</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-1/3 mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Products</h2>
        <div className="border p-4 mb-4">No products available</div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Cart</h2>
        <div className="border p-4 mb-4">Cart is empty</div>
        <div className="space-y-2">
          <p>Subtotal: KES 0</p>
          <p>Tax (16%): KES 0</p>
          <p>Total: KES 0</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700">Process Sale</button>
      </div>
    </div>
  );
}

export default PointOfSale;