"use client";

import { useState } from "react";
import { Package } from "lucide-react";

interface BookingForm {
  pickupAddress: string;
  deliveryAddress: string;
  size: string;
  type: string;
  paymentType: "COD" | "Prepaid";
}

export default function BookingForm() {
  const [form, setForm] = useState<BookingForm>({
    pickupAddress: "",
    deliveryAddress: "",
    size: "",
    type: "",
    paymentType: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to book parcel");

      const data = await res.json();
      setMessage("Parcel booked successfully! ID: " + data._id);
      setForm({ pickupAddress: "", deliveryAddress: "", size: "", type: "", paymentType: "COD" });
    } catch  {
      setMessage( "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" /> Book Parcel
        </h2>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Pickup Address</label>
            <input
              type="text"
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Delivery Address</label>
            <input
              type="text"
              name="deliveryAddress"
              value={form.deliveryAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Parcel Size</label>
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Parcel Type</label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Payment Type</label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Prepaid">Prepaid</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book Parcel"}
          </button>
        </form>
      </div>
    
  );
}
