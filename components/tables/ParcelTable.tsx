"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/ul/Pagintaion"; // Import the pagination component

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  customer?: { name: string };
  agent?: { name: string };
}

interface ParcelTableProps {
  assignedOnly?: boolean; // For agent dashboard
  customerOnly?: boolean; // For customer dashboard
}

const ParcelTable: React.FC<ParcelTableProps> = ({
  assignedOnly,
  customerOnly,
}) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // items per page

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      setError("");

      try {
        let url = `/api/parcels?page=${page}&limit=${limit}`;
        if (assignedOnly) url += "&assigned=true";
        if (customerOnly) url += "&customer=true";

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch parcels");

        const data = await res.json();
        setParcels(data.data || data.parcels || []); // handle different API response
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [assignedOnly, customerOnly, page]);

  if (loading) return <p className="text-gray-500 p-4">Loading parcels...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (parcels.length === 0)
    return <p className="text-gray-500 p-4">No parcels found.</p>;

  return (
    <>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Pickup
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Delivery
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Agent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="px-4 py-2">{parcel._id}</td>
                <td className="px-4 py-2">{parcel.pickupAddress}</td>
                <td className="px-4 py-2">{parcel.deliveryAddress}</td>
                <td className="px-4 py-2">{parcel.status}</td>
                <td className="px-4 py-2">{parcel.customer?.name || "N/A"}</td>
                <td className="px-4 py-2">
                  {parcel.agent?.name || "Unassigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Component */}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

export default ParcelTable;
