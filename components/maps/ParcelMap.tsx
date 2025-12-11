"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Example markers
const exampleParcels = [
  { id: "1", lat: 23.8103, lng: 90.4125, title: "Parcel 1" }, // Dhaka
  { id: "2", lat: 22.3569, lng: 91.7832, title: "Parcel 2" }, // Chittagong
];

const ParcelMap: React.FC = () => {
  return (
    <div className="w-full h-[400px] rounded shadow overflow-hidden">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {exampleParcels.map(parcel => (
          <Marker key={parcel.id} position={[parcel.lat, parcel.lng]}>
            <Popup>{parcel.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ParcelMap;
