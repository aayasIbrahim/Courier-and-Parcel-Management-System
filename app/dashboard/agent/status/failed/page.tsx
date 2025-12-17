"use client";

import { useState, useEffect } from "react";
import ParcelTable from "@/components/tables/ParcelTable";

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
}

export default function FailedPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch parcels with status "Failed"
  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/parcels?status=Failed");
        const data = await res.json();
          setParcels(Array.isArray(data.data) ? data.data : data.parcels || []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load parcels.");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  return (
    <>
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-red-600">Failed Parcels</h2>

      {loading ? (
        <p className="text-gray-500">Loading parcels...</p>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No failed parcels found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-red-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">Parcel ID</th>
                <th className="px-4 py-2 border-b">Pickup Address</th>
                <th className="px-4 py-2 border-b">Delivery Address</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-red-50">
                  <td className="px-4 py-2 border-b">{parcel._id}</td>
                  <td className="px-4 py-2 border-b">{parcel.pickupAddress}</td>
                  <td className="px-4 py-2 border-b">{parcel.deliveryAddress}</td>
                  <td className="px-4 py-2 border-b text-red-700 font-semibold">
                    {parcel.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && (
    
    <div className="p-3 rounded bg-red-100 text-red-800 whitespace-pre-line">{message}</div>
      )}
       <ParcelTable assignedOnly={true} />
    </div>
   
    </>
  );
}
