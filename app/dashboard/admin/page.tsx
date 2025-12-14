"use client";

import React, { useEffect, useState } from "react";
import MetricCard from "@/components/cards/MetricCard";
import ParcelTable from "@/components/tables/ParcelTable";
import UsersTable from "@/components/tables/UserTable";

interface Metrics {
  totalParcels: number;
  delivered: number;
  inTransit: number;
}

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/reports", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch metrics");
        const data = await res.json();
        setMetrics({
          totalParcels: data.totalParcels || 0,
          delivered: data.delivered || 0,
          inTransit: data.inTransit || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Parcels"
          value={loading ? "..." : metrics?.totalParcels || 0}
        />
        <MetricCard
          title="Delivered"
          value={loading ? "..." : metrics?.delivered || 0}
        />
        <MetricCard
          title="In Transit"
          value={loading ? "..." : metrics?.inTransit || 0}
        />
      </div>

      {/* Parcel Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Parcels</h2>
        <ParcelTable /> {/* Already fetches parcels from API */}
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <UsersTable /> {/* Already fetches users from API */}
      </div>
    </div>
  );
};

export default AdminDashboard;
