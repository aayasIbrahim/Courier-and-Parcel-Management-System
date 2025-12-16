"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Parcel {
  _id: string;
  status: string;
  currentLocation?: { lat: number; lng: number };
}

export default function AgentRoutePage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const watchIdsRef = useRef<Record<string, number>>({}); // parcelId -> watchId

  // Fetch assigned parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch("/api/parcels/assigned");
        const data = await res.json();
        if (data.parcels && data.parcels.length > 0) {
          setParcels(data.parcels);
        }
      } catch (err) {
        console.error("Error fetching assigned parcels:", err);
      }
    };
    fetchParcels();
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    );

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Receive live parcel updates from server
    socketRef.current.on("parcelUpdate", (updatedParcel: Parcel) => {
      setParcels((prev) =>
        prev.map((p) =>
          p._id === updatedParcel._id ? { ...p, ...updatedParcel } : p
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Start geolocation tracking for all parcels
  useEffect(() => {
    parcels.forEach((parcel) => {
      if (parcel.status !== "Delivered" && !watchIdsRef.current[parcel._id]) {
        socketRef.current?.emit("joinParcel", parcel._id);

        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            socketRef.current?.emit("updateParcel", {
              _id: parcel._id,
              status: parcel.status === "Pending" ? "Picked Up" : parcel.status,
              currentLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
            });
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 5000 }
        );

        watchIdsRef.current[parcel._id] = watchId;
      }
    });

    // Stop tracking delivered parcels
    parcels.forEach((parcel) => {
      if (parcel.status === "Delivered" && watchIdsRef.current[parcel._id]) {
        navigator.geolocation.clearWatch(watchIdsRef.current[parcel._id]);
        delete watchIdsRef.current[parcel._id];
      }
    });
  }, [parcels]);

  const getStatusColor = (status: string) => {
    if (status === "Delivered") return "text-green-600";
    if (status === "Picked Up") return "text-blue-600";
    if (status === "In Transit") return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">🚴 Agent Live Tracking</h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500">No assigned parcels</p>
      ) : (
        <ul className="space-y-4">
          {parcels.map((parcel) => (
            <li
              key={parcel._id}
              className="border rounded p-4 shadow-sm hover:shadow-md transition"
            >
              <p>
                <strong>ID:</strong> {parcel._id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusColor(parcel.status)}>{parcel.status}</span>
              </p>
              {parcel.currentLocation ? (
                <p>
                  <strong>Live Location:</strong>{" "}
                  {parcel.currentLocation.lat.toFixed(5)}, {parcel.currentLocation.lng.toFixed(5)}
                </p>
              ) : (
                <p className="text-gray-400">Live location not available yet</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
