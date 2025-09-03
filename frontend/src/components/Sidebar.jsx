import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

function Sidebar() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' }, // Adjusted paths to match routes
    { id: 'inventory', label: 'Inventory', path: '/inventory' },
    { id: 'pos', label: 'Point of Sale', path: '/pos' },
    { id: 'sales', label: 'Sales History', path: '/sales' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">TWOG Hardware</h2>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path} // Use the path for navigation
            className="block text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;