"use client";

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/users/customers", {
          credentials: "include",
        });

        const data = await res.json();
        setCustomers(data?.users ?? []);
      } catch {
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading customers...
        </div>
      )}

      {/* Desktop Table */}
      {!loading && customers.length > 0 && (
        <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && customers.length > 0 && (
        <div className="md:hidden space-y-4">
          {customers.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded shadow p-4"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-600">{c.email}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && customers.length === 0 && (
        <p className="text-gray-500">No customers found.</p>
      )}
    </div>
  );
}
