import React from "react";

interface ParcelTableProps {
  assignedOnly?: boolean;   // For agent dashboard
  customerOnly?: boolean;   // For customer dashboard
}

const ParcelTable: React.FC<ParcelTableProps> = ({ assignedOnly, customerOnly }) => {
  // TODO: Replace with real API data
  const parcels = [
    {
      id: "1",
      pickupAddress: "Dhaka",
      deliveryAddress: "Chittagong",
      status: "In Transit",
      customer: "John Doe",
      agent: "Agent 1",
    },
    {
      id: "2",
      pickupAddress: "Sylhet",
      deliveryAddress: "Dhaka",
      status: "Delivered",
      customer: "Alice",
      agent: "Agent 2",
    },
  ];

  // Optional filtering
  const filteredParcels = parcels.filter(p => {
    if (assignedOnly) return p.agent === "Agent 1"; // Example filter
    if (customerOnly) return p.customer === "John Doe"; // Example filter
    return true;
  });

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pickup</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delivery</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Agent</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredParcels.map(parcel => (
            <tr key={parcel.id}>
              <td className="px-4 py-2">{parcel.id}</td>
              <td className="px-4 py-2">{parcel.pickupAddress}</td>
              <td className="px-4 py-2">{parcel.deliveryAddress}</td>
              <td className="px-4 py-2">{parcel.status}</td>
              <td className="px-4 py-2">{parcel.customer}</td>
              <td className="px-4 py-2">{parcel.agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelTable;
