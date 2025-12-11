import React from "react";
import ParcelTable from "@/components/tables/ParcelTable";

const CustomerDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      {/* Book a Parcel */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Book a Parcel</h2>
        {/* TODO: Add booking form component */}
        <div className="p-4 bg-white rounded shadow">Booking form goes here</div>
      </div>

      {/* Booking History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Booking History</h2>
        <ParcelTable customerOnly /> {/* optional prop to filter customer's parcels */}
      </div>
    </div>
  );
};

export default CustomerDashboard;
