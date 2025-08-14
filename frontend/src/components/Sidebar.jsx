import React from 'react';

function Sidebar({ setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'pos', label: 'Point of Sale' },
    { id: 'sales', label: 'Sales History' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">TWOG Hardware</h2>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;