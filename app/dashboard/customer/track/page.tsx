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
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Fetch parcels from API
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch("/api/parcels");
        const data = await res.json();
        const list = Array.isArray(data.data) ? data.data : [];
        setParcels(list);
        if (list.length > 0) setSelectedParcel(list[0]);
      } catch (err) {
        console.error("Error fetching parcels:", err);
      }
    };
    fetchParcels();
  }, []);

  // Connect to Socket.IO for live updates (hard-coded URL)
  useEffect(() => {
    const socketUrl =
      "https://courier-and-parcel-management-syste-six.vercel.app"; // hard-coded
    socketRef.current = io(socketUrl, { transports: ["websocket"] });

    socketRef.current.on("connect", () =>
      console.log("Connected to socket server")
    );

    // Update parcel location/status in real-time
    socketRef.current.on("parcelUpdate", (update: Parcel) => {
      setParcels((prev) =>
        prev.map((p) =>
          p._id === update._id
            ? {
                ...p,
                ...update,
                currentLocation: update.currentLocation ?? p.currentLocation,
              }
            : p
        )
      );

      setSelectedParcel((prev) =>
        prev && prev._id === update._id
          ? {
              ...prev,
              ...update,
              currentLocation: update.currentLocation ?? prev.currentLocation,
            }
          : prev
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map center
  const center = selectedParcel?.currentLocation || {
    lat: 23.8103,
    lng: 90.4125,
  };

  // Auto-pan map on location update
  useEffect(() => {
    if (selectedParcel?.currentLocation && mapRef.current) {
      mapRef.current.panTo(selectedParcel.currentLocation);
    }
  }, [selectedParcel?.currentLocation]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        <Map className="h-6 w-6" /> Track Parcel
      </h2>

      {/* Dropdown for parcels */}
      <div className="relative w-full max-w-md" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-white border rounded px-4 py-2 flex justify-between items-center shadow-sm hover:shadow-md transition"
        >
          {selectedParcel
            ? `📦 ${selectedParcel._id} | ${selectedParcel.status}`
            : "— Select Parcel —"}
          <span className="ml-2">▼</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-72 overflow-y-auto mt-1">
            {parcels.map((p) => (
              <li
                key={p._id}
                onClick={() => {
                  setSelectedParcel(p);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm transition"
              >
                <div className="font-semibold">
                  {p.type === "Fragile" ? "🧨" : "📦"} {p._id}
                </div>
                <div className="text-gray-600 truncate">
                  {p.pickupAddress} → {p.deliveryAddress}
                </div>
                <div className="text-gray-500 text-xs">Status: {p.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      {isLoaded && selectedParcel ? (
        <div className="h-96 w-full border rounded overflow-hidden shadow-sm">
          <GoogleMap
            zoom={15}
            center={center}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
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
