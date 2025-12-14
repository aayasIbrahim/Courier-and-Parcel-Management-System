"use client";

import { useState, useEffect, useRef } from "react";
import ParcelTable from "@/components/tables/ParcelTable";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
}

export default function InTransitPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch parcels with status "In Transit"
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch("/api/parcels?status=In Transit");
        const data = await res.json();
        setParcels(data || []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch parcels.");
      }
    };
    fetchParcels();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update parcel status (Delivered or Failed)
  const handleUpdate = async (status: "Delivered" | "Failed") => {
    if (!selectedParcel) return alert("Select a parcel first!");
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/parcels/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: selectedParcel._id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMessage(`✅ Parcel ${data.parcel._id} status updated to "${status}"`);
      setSelectedParcel(null);

      // Update local state
      setParcels(prev =>
        prev.map(p =>
          p._id === selectedParcel._id ? { ...p, status } : p
        )
      );
    } catch {
      setMessage("❌ Failed to update parcel status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
      <h2 className="text-2xl font-bold">Parcels: In Transit</h2>

      {/* Dropdown to select parcel */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="w-full border px-3 py-2 rounded text-left focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
        >
          {selectedParcel
            ? `${selectedParcel._id} - ${selectedParcel.pickupAddress} → ${selectedParcel.deliveryAddress} (${selectedParcel.status})`
            : "Select a parcel"}
          <span className="ml-2">{dropdownOpen ? "▲" : "▼"}</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-60 overflow-auto transition-all duration-200">
            {parcels.map(parcel => {
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

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleUpdate("Delivered")}
          disabled={loading || !selectedParcel}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Mark as Delivered"}
        </button>

        <button
          onClick={() => handleUpdate("Failed")}
          disabled={loading || !selectedParcel}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Mark as Failed"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 rounded bg-green-100 text-green-800 whitespace-pre-line">{message}</div>
      )}

      {/* Table of in-transit parcels */}
      <ParcelTable assignedOnly  />
    </div>
  );
}
