"use client";

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "customer";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
        });

        const data = await res.json();

        setUsers(data?.users ?? []);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">All Users</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading users...
        </div>
      )}

      {/* Desktop Table */}
      {!loading && users?.length > 0 && (
        <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && users?.length > 0 && (
        <div className="md:hidden space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded shadow p-4 space-y-2"
            >
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
              <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && users?.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
