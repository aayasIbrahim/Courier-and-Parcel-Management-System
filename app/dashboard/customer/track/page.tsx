"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Map } from "lucide-react";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  currentLocation?: { lat: number; lng: number };
}

export default function TrackParcelPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  // Load Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Fetch parcels only once
  useEffect(() => {
    fetch("/api/parcels")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setParcels(data);
        else if (Array.isArray(data.parcels)) setParcels(data.parcels);
        else setParcels([]);
      })
      .catch(console.error);
  }, []);

 useEffect(() => {
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

  const s: Socket = io(socketUrl, {
    transports: ["websocket"],
  });

  // RECEIVE PARCEL UPDATES
  s.on("parcelUpdate", (data: Parcel) => {
    // update list
    setParcels((prev) =>
      prev.map((p) => (p._id === data._id ? { ...p, ...data } : p))
    );

    // update selected parcel (SAFE)
    setSelectedParcel((prev) =>
      prev && prev._id === data._id ? { ...prev, ...data } : prev
    );
  });

  // CLEANUP FUNCTION
  return () => {
    s.disconnect(); // no return value → TypeScript OK
  };
}, []);
 // ← IMPORTANT: no dependency, so no re-renders

  const center =
    selectedParcel?.currentLocation || { lat: 23.8103, lng: 90.4125 };

  return (

      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Map className="h-5 w-5" /> Track Parcel
        </h2>

        {/* Dropdown */}
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          onChange={(e) => {
            const parcel = parcels.find((p) => p._id === e.target.value);
            setSelectedParcel(parcel || null);
          }}
          value={selectedParcel?._id || ""}
        >
          <option value="">Select a parcel</option>
          {parcels.map((p) => (
            <option key={p._id} value={p._id}>
              {p._id} — {p.status}
            </option>
          ))}
        </select>

        {/* Map */}
        {isLoaded && selectedParcel ? (
          <div className="w-full h-96 border rounded overflow-hidden">
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
            >
              {selectedParcel.currentLocation && (
                <Marker position={selectedParcel.currentLocation} />
              )}
            </GoogleMap>
          </div>
        ) : (
          <p className="text-gray-500">Select a parcel to track its location</p>
        )}
      </div>

  );
}
