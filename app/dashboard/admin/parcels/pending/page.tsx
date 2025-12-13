"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  type: string;
  paymentType: string;
  createdAt: string;
}

export default function PendingParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingParcels = async () => {
      try {
        const res = await fetch("/api/parcels?status=Pending", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch pending parcels");

        const data = await res.json();
        setParcels(Array.isArray(data) ? data : data.parcels || []);
      } catch  {
        setError("Unable to load pending parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingParcels();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-yellow-600" />
        <h1 className="text-2xl font-semibold">Pending Parcels</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading pending parcels...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && parcels.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Parcel ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Route</th>
                <th className="p-3">Booked Date</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{p._id}</td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3">{p.paymentType}</td>
                  <td className="p-3 text-xs">
                    {p.pickupAddress} → {p.deliveryAddress}
                  </td>
                  <td className="p-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && parcels.length > 0 && (
        <div className="md:hidden space-y-4">
          {parcels.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded shadow p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs">{p._id}</span>
                <span className="text-xs font-medium text-yellow-600">
                  Pending
                </span>
              </div>

              <div className="text-sm">
                <strong>Type:</strong> {p.type}
              </div>

              <div className="text-sm">
                <strong>Payment:</strong> {p.paymentType}
              </div>

              <div className="text-xs text-gray-600">
                {p.pickupAddress} → {p.deliveryAddress}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && parcels.length === 0 && (
        <p className="text-gray-500">No pending parcels found.</p>
      )}
    </div>
  );
}
