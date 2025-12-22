"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/ul/Pagintaion";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  customer?: { name: string };
  agent?: { name: string };
}

interface ParcelTableProps {
  assignedOnly?: boolean;
  customerOnly?: boolean;
}

const ParcelTable: React.FC<ParcelTableProps> = ({
  assignedOnly,
  customerOnly,
}) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 5;

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      setError("");

      try {
        let url = `/api/parcels?page=${page}&limit=${limit}`;
        if (assignedOnly) url += "&assigned=true";
        if (customerOnly) url += "&customer=true";

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch parcels");

        const data = await res.json();
        setParcels(data.data || data.parcels || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [assignedOnly, customerOnly, page]);

  // ---------------- DELETE LOGIC ----------------
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this parcel?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/parcels/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove from UI
      setParcels((prev) => prev.filter((parcel) => parcel._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete parcel");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-gray-500 p-4">Loading parcels...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (parcels.length === 0)
    return <p className="text-gray-500 p-4">No parcels found.</p>;

  return (
    <>
     <div className="space-y-4">
  {parcels.map((parcel) => (
    <div
      key={parcel._id}
      className="bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
    >
      {/* Left: Parcel Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        {/* ID */}
        <div className="text-gray-500 font-mono text-xs">
          ID: <span className="font-semibold">{parcel._id.slice(-6)}</span>
        </div>

        {/* Pickup / Delivery */}
        <div className="mt-2 sm:mt-0">
          <div className="text-gray-700 text-sm">
            <span className="font-semibold">Pickup:</span> {parcel.pickupAddress}
          </div>
          <div className="text-gray-700 text-sm mt-1">
            <span className="font-semibold">Delivery:</span> {parcel.deliveryAddress}
          </div>
        </div>

        {/* Customer / Agent */}
        <div className="mt-2 sm:mt-0">
          <div className="text-gray-600 text-sm">
            <span className="font-semibold">Customer:</span> {parcel.customer?.name || "—"}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            <span className="font-semibold">Agent:</span> {parcel.agent?.name || "Unassigned"}
          </div>
        </div>
      </div>

      {/* Right: Status + Action */}
      <div className="flex items-center mt-4 sm:mt-0 space-x-3">
        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
          ${
            parcel.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : parcel.status === "In Transit"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {parcel.status}
        </span>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(parcel._id)}
          disabled={deletingId === parcel._id}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium
          text-red-600 border border-red-200 rounded-md
          hover:bg-red-50 transition disabled:opacity-50"
        >
          {deletingId === parcel._id ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  ))}
</div>


      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

export default ParcelTable;
