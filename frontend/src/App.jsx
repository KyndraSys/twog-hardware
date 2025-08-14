import React, { useState } from "react";

import Dashboard from "./components/Dasboard";
import Sidebar from "./components/Sidebar";
import Inventory from "./components/Inventory";
import PointOfSale from "./components/PoinOfSale";
import SalesHistory from "./components/SalesHistory";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "pos":
        return <PointOfSale />;
      case "sales":
        return <SalesHistory />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setCurrentView={setCurrentView} />
      <main className="flex-1 p-6">{renderView()}</main>
    </div>
  );
}

export default App;
