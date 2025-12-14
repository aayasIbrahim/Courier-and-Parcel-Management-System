"use client";

import React, { useState } from "react";
import ParcelTable from "@/components/tables/ParcelTable";
import BookingForm from "@/components/customer/BookingForm";

const CustomerDashboard = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleBookingSuccess = () => {
    // Toggle refresh to trigger ParcelTable update
    setRefreshTable((prev) => !prev);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      {/* Book a Parcel */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Book a Parcel</h2>
        <BookingForm onSuccess={handleBookingSuccess} />
      </div>

      {/* Booking History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Booking History</h2>
        <ParcelTable customerOnly key={refreshTable.toString()} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
