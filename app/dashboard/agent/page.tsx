

import React from "react";
import ParcelTable from "@/components/tables/ParcelTable";
import ParcelMap from "@/components/maps/ParcelMap";

const AgentDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>

      {/* Assigned Parcels Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Assigned Parcels</h2>
        <ParcelTable assignedOnly /> {/* optional prop to filter assigned */}
      </div>

      {/* Route Map */}
      <div>
        <h2 className="text-xl font-semibold mb-2 z-1">Delivery Route</h2>
        <ParcelMap />
      </div>
    </div>
  );
};

export default AgentDashboard;
