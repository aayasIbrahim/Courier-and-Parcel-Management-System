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

const parcelSizes = ["Small", "Medium", "Large", "Extra Large"];
const parcelTypes = ["Normal", "Fragile", "Liquid", "Electronics", "Documents", "Clothing", "Other"];

interface BookingFormProps {
  onSuccess?: (data: { id: string; type: string }) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
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
      setMessage(`📦 Parcel booked successfully!\nID: ${data.id}\nType: ${data.type}`);

      // Call parent callback if provided
      onSuccess?.({ id: data._id, type: data.type });

      // Reset form
      setForm({ pickupAddress: "", deliveryAddress: "", size: "", type: "", paymentType: "COD" });
    } catch {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md sm:p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600" /> Book Parcel
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded text-sm sm:text-base bg-green-100 text-green-800 whitespace-pre-line">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Address */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={form.pickupAddress}
            onChange={handleChange}
            placeholder="Enter pickup address"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={form.deliveryAddress}
            onChange={handleChange}
            placeholder="Enter delivery address"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Size and Type */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Parcel Size</label>
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Size</option>
              {parcelSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Parcel Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Type</option>
              {parcelTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Payment Type</label>
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Booking..." : "Book Parcel"}
        </button>
      </form>
    </div>
  );
}
