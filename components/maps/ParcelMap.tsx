"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { io, Socket } from "socket.io-client";
import "leaflet/dist/leaflet.css";

// ---------------- Custom Marker ----------------
const parcelIcon = new Icon({
  iconUrl: "/percel-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// ---------------- Types ----------------
interface Parcel {
  _id: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  lat?: number;
  lng?: number;
  title?: string;
  status?: string;
  customerId?: string; // optional if you filter by customer
}

// ---------------- Component ----------------
const ParcelMap: React.FC<{ customerId?: string }> = ({ customerId }) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  const defaultCenter: LatLngExpression = [23.8103, 90.4125]; // Dhaka

  // ---------------- Fetch parcels from API ----------------
useEffect(() => {
  const fetchParcels = async () => {
    try {
      const res = await fetch("/api/parcels?status=In Transit", {
        credentials: "include",
      });

      // ✅ Type the API response
      const data: { data: Parcel[] } = await res.json();

      const mappedParcels = (data.data || []).map((p: Parcel, i: number) => ({
        ...p,
        lat: p.lat ?? 23.81 + i * 0.01,
        lng: p.lng ?? 90.41 + i * 0.01,
        title: p.title ?? p._id,
      }));

      // Optional: filter by customer
      const filtered = customerId
        ? mappedParcels.filter((p) => p.customerId === customerId)
        : mappedParcels;

      setParcels(filtered);
      if (filtered.length > 0) setSelectedParcelId(filtered[0]._id);
    } catch (err) {
      console.error("Failed to fetch parcels:", err);
    }
  };

  fetchParcels();
}, [customerId]);


  // ---------------- Socket.io live updates ----------------
  useEffect(() => {
    const socket: Socket = io(
      "https://courier-and-parcel-management-syste-six.vercel.app",
      { transports: ["websocket"] }
    );

    socket.on("connect", () => console.log("Connected to socket server"));

    socket.on("parcelUpdate", (updates: Parcel[]) => {
      const mappedUpdates = (updates || []).map((p, i) => ({
        ...p,
        lat: p.lat ?? 23.81 + i * 0.01,
        lng: p.lng ?? 90.41 + i * 0.01,
        title: p.title ?? p._id,
      }));

      const filteredUpdates = customerId
        ? mappedUpdates.filter((p) => p.customerId === customerId)
        : mappedUpdates;

      setParcels((prev) => {
        // Merge updates
        const merged = prev.map((p) => {
          const update = filteredUpdates.find((u) => u._id === p._id);
          return update ?? p;
        });

        // Add any new parcels
        filteredUpdates.forEach((p) => {
          if (!merged.find((m) => m._id === p._id)) merged.push(p);
        });

        return merged;
      });

      // Set selectedParcelId if not already set
      setSelectedParcelId((prev) => prev || (filteredUpdates[0]?._id ?? null));
    });

    return () => {
      socket.disconnect();
    };
  }, [customerId]);

  const selectedParcel = parcels.find((p) => p._id === selectedParcelId);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white shadow-lg rounded p-4 h-[500px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Parcels</h2>
        {parcels.length === 0 && <p className="text-gray-500">No parcels available</p>}
        <ul className="space-y-2">
          {parcels.map((parcel) => (
            <li
              key={parcel._id}
              className={`p-2 rounded cursor-pointer transition ${
                selectedParcelId === parcel._id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedParcelId(parcel._id)}
            >
              <h3 className="font-medium text-gray-800">
                {parcel.title} {parcel.status ? `(${parcel.status})` : ""}
              </h3>
              {parcel.pickupAddress && parcel.deliveryAddress && (
                <p className="text-sm text-gray-500 truncate">
                  {parcel.pickupAddress} → {parcel.deliveryAddress}
                </p>
              )}
              <p className="text-xs text-gray-600">
                Lat: {parcel.lat?.toFixed(4)}, Lng: {parcel.lng?.toFixed(4)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <div className="md:w-3/4 h-[500px] rounded shadow overflow-hidden">
        <MapContainer
          center={
            selectedParcel
              ? ([selectedParcel.lat!, selectedParcel.lng!] as LatLngExpression)
              : defaultCenter
          }
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {parcels.map(
            (parcel) =>
              parcel.lat &&
              parcel.lng && (
                <Marker
                  key={parcel._id}
                  position={[parcel.lat, parcel.lng] as LatLngExpression}
                  icon={parcelIcon}
                >
                  <Popup>
                    <strong>{parcel.title}</strong>
                    <br />
                    {parcel.pickupAddress && parcel.deliveryAddress
                      ? `${parcel.pickupAddress} → ${parcel.deliveryAddress}`
                      : ""}
                    <br />
                    {parcel.status && `Status: ${parcel.status}`}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ParcelMap;
