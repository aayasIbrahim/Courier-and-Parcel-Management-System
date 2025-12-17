"use client";

import { useEffect, useState } from "react";
import { Users, Loader2, Trash2 } from "lucide-react";

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

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Change role
  const handleRoleChange = async (userId: string, role: User["role"]) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      );
    } catch {
      alert("Failed to update role");
    }
  };

  // 🔹 Delete user
  const handleDelete = async (userId: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading users...
        </div>
      )}

      {/* Users Table (desktop) */}
      {!loading && users.length > 0 && (
        <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value as User["role"])
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="agent">Agent</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 flex items-center gap-1 text-sm hover:text-red-800"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users List (mobile) */}
      {!loading && users.length > 0 && (
        <div className="md:hidden space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-4 rounded shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{u.name}</p>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600 flex items-center gap-1 text-sm hover:text-red-800"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
              <p className="text-gray-600 text-sm">{u.email}</p>
              <div>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u._id, e.target.value as User["role"])
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No users */}
      {!loading && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
