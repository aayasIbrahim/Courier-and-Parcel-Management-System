"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Map } from "lucide-react";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  type: string;
  currentLocation?: { lat: number; lng: number };
}

export default function TrackParcelPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket | null>(null);

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Fetch customer parcels
  useEffect(() => {
    fetch("/api/parcels")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.parcels || [];
        setParcels(list);

        // Auto-select first parcel
        if (list.length > 0) setSelectedParcel(list[0]);
      })
      .catch(console.error);
  }, []);

  // Socket connection for live updates
  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

    socketRef.current = io(socketUrl, { transports: ["websocket"] });

    socketRef.current.on("connect", () => console.log("Connected to socket server"));

    // Listen for parcel updates
    socketRef.current.on("parcelUpdate", (update: Parcel) => {
      setParcels((prev) =>
        prev.map((p) => (p._id === update._id ? { ...p, ...update } : p))
      );

      setSelectedParcel((prev) =>
        prev && prev._id === update._id ? { ...prev, ...update } : prev
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const center = selectedParcel?.currentLocation || { lat: 23.8103, lng: 90.4125 };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Map className="h-5 w-5" /> Track Parcel
      </h2>

      {/* Dropdown */}
      <div className="relative w-full max-w-md" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-white border rounded px-4 py-2 flex justify-between items-center"
        >
          {selectedParcel
            ? `📦 ${selectedParcel._id} | ${selectedParcel.status}`
            : "— Select Parcel —"}
          <span>▼</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-72 overflow-y-auto">
            {parcels.map((p) => (
              <li
                key={p._id}
                onClick={() => {
                  setSelectedParcel(p);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              >
                <div className="font-semibold">
                  {p.type === "Fragile" ? "🧨" : "📦"} {p._id}
                </div>
                <div className="text-gray-600 truncate">
                  {p.pickupAddress} → {p.deliveryAddress}
                </div>
                <div>Status: {p.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      {isLoaded && selectedParcel ? (
        <div className="h-96 border rounded overflow-hidden mt-4">
          <GoogleMap
            zoom={15}
            center={center}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {selectedParcel.currentLocation && (
              <Marker position={selectedParcel.currentLocation} />
            )}
          </GoogleMap>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">
          {selectedParcel
            ? "Waiting for live location..."
            : "Select a parcel to track live location"}
        </p>
      )}
    </div>
  );
}
