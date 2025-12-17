"use client";

import { useEffect, useState } from "react";
import { Package, Loader2 } from "lucide-react";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  type: string;
  paymentType: string;
  createdAt: string;
}

export default function AdminAllParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch("/api/parcels", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch parcels");
        const parcelData = await res.json();
        setParcels(parcelData.data || []);
      } catch {
        setError("Unable to load parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">All Parcels</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading parcels...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
      )}

      {/* Desktop Table */}
      {!loading && parcels.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Parcel ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Route</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{p._id}</td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          p.status === "Delivered" &&
                          "bg-green-100 text-green-700"
                        }
                        ${
                          p.status === "Pending" &&
                          "bg-yellow-100 text-yellow-700"
                        }
                        ${p.status === "Failed" && "bg-red-100 text-red-700"}
                        ${
                          p.status === "In Transit" &&
                          "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {p.status}
                    </span>
                  </td>
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
            <div key={p._id} className="bg-white rounded shadow p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs">{p._id}</span>
                <span className="text-xs font-medium">{p.status}</span>
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
        <p className="text-gray-500">No parcels found.</p>
      )}
    </div>
  );
}
