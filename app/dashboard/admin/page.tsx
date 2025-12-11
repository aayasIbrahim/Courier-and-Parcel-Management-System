"use client"

import React from "react";
import MetricCard from "@/components/cards/MetricCard";
import ParcelTable from "@/components/tables/ParcelTable";
import UsersTable from "@/components/tables/UserTable";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Total Parcels" value={120} />
        <MetricCard title="Delivered" value={95} />
        <MetricCard title="In Transit" value={20} />
      </div>

      {/* Parcel Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Parcels</h2>
        <ParcelTable />
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <UsersTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
