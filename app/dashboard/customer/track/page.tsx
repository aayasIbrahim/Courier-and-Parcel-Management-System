"use client";

import { useState, useEffect, useRef } from "react";
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

  // Load Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Fetch parcels
  useEffect(() => {
    fetch("/api/parcels")
      .then((res) => res.json())
      .then((data) => setParcels(Array.isArray(data) ? data : data.parcels || []))
      .catch(console.error);
  }, []);


useEffect(() => {
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

  const s = io(socketUrl, { transports: ["websocket"] });

  s.on("parcelUpdate", (data: Parcel) => {
    setParcels((prev) =>
      prev.map((p) => (p._id === data._id ? { ...p, ...data } : p))
    );

    setSelectedParcel((prev) =>
      prev && prev._id === data._id ? { ...prev, ...data } : prev
    );
  });

  // ✅ FIX: return a cleanup function that returns void
  return () => {
    s.disconnect();
  };
}, []);


  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

      {/* Custom Dropdown */}
      <div className="relative w-full max-w-md" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {selectedParcel
            ? `📦 ID: ${selectedParcel._id} | ${selectedParcel.status}`
            : "— Select a Parcel —"}
          <span className="ml-2 transform rotate-90">▶</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-72 overflow-y-auto">
            {parcels.map((p) => (
              <li
                key={p._id}
                onClick={() => {
                  setSelectedParcel(p);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  {p.type === "Fragile" ? "🧨" : "📦"}
                  <span className="font-semibold">ID: {p._id}</span>
                </div>
                <div className="text-gray-600 mt-1 md:mt-0 md:text-right">
                  <div>Status: <span className={p.status === "Delivered" ? "text-green-600" : p.status === "Failed" ? "text-red-600" : "text-yellow-600"}>{p.status}</span></div>
                  <div className="truncate">{p.pickupAddress} → {p.deliveryAddress}</div>
                  <div>Type: {p.type}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Google Map */}
      {isLoaded && selectedParcel ? (
        <div className="w-full h-96 border rounded overflow-hidden mt-4">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {selectedParcel.currentLocation && <Marker position={selectedParcel.currentLocation} />}
          </GoogleMap>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Select a parcel to track its location</p>
      )}
    </div>
  );
}
