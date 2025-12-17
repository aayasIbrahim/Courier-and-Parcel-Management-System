"use client";

import { useState, useEffect, useRef } from "react";
import ParcelTable from "@/components/tables/ParcelTable";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
}

export default function PickedUpPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch parcels with status "Picked Up"
  const fetchParcels = async () => {
    setError("");
    try {
      const res = await fetch("/api/parcels?status=Picked Up");
      const data = await res.json();
      setParcels(Array.isArray(data.data) ? data.data : data.parcels || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load parcels");
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update parcel status
  const handleUpdate = async () => {
    if (!selectedParcel) return;
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/parcels/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: selectedParcel._id, status: "In Transit" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setMessage(`✅ Parcel ${selectedParcel._id} status updated to "In Transit"`);
      setSelectedParcel(null);

      // Update local state
      setParcels((prev) =>
        prev.map((p) =>
          p._id === selectedParcel._id ? { ...p, status: "In Transit" } : p
        )
      );
    } catch  {
    
      setError(`❌  "Failed to update parcel status"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Update Parcel Status: Picked Up → In Transit</h2>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-full border px-3 py-2 rounded text-left focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
        >
          {selectedParcel
            ? `${selectedParcel._id} - ${selectedParcel.pickupAddress} → ${selectedParcel.deliveryAddress} (${selectedParcel.status})`
            : "Select a parcel"}
          <span className="ml-2">{dropdownOpen ? "▲" : "▼"}</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-60 overflow-auto transition-all duration-200">
            {parcels.length === 0 && (
              <li className="px-3 py-2 text-gray-500">No parcels available</li>
            )}
            {parcels.map((parcel) => {
              const isSelected = selectedParcel?._id === parcel._id;
              return (
                <li
                  key={parcel._id}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center hover:bg-blue-100 ${
                    isSelected ? "bg-blue-200 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedParcel(parcel);
                    setDropdownOpen(false);
                  }}
                >
                  <span>
                    {parcel._id} - {parcel.pickupAddress} → {parcel.deliveryAddress} ({parcel.status})
                  </span>
                  {isSelected && <span className="text-blue-600 font-bold">✔</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={loading || !selectedParcel}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>

      {/* Messages */}
      {message && (
        <div className="p-3 rounded bg-green-100 text-green-800 whitespace-pre-line">{message}</div>
      )}
      {error && (
        <div className="p-3 rounded bg-red-100 text-red-800 whitespace-pre-line">{error}</div>
      )}

      {/* Parcel Table with Pagination */}
      <ParcelTable assignedOnly />
    </div>
  );
}
