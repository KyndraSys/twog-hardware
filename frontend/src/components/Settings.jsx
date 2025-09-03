import React from 'react';

function Settings() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">System Settings</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">System Preferences</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Enable low stock alerts
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Auto-backup data daily
          </label>
        </div>
      </div>
      <div>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Export All Data</button>
      </div>
    </div>
  );
}

export default Settings;