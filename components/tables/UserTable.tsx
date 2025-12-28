"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../ui/ul/Pagintaion"; // your pagination component

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "customer";
  phone?: string;
  address?: string;
}

interface UsersTableProps {
  roleFilter?: "admin" | "agent" | "customer";
}

const UsersTable: React.FC<UsersTableProps> = ({ roleFilter }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 5; // items per page

  // ---------------- FETCH USERS ----------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let url = `/api/users?page=${page}&limit=${limit}`;
        if (roleFilter) url += `&role=${roleFilter}`;

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, page]);

  // ---------------- DELETE LOGIC ----------------
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove user from UI
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- RENDER ----------------
  if (loading) return <p className="text-gray-500 p-4">Loading users...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (users.length === 0)
    return <p className="text-gray-500 p-4">No users found.</p>;

  return (
    <>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
          >
            {/* Left: User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full sm:w-auto">
              {/* ID */}
              <div className="text-gray-500 font-mono text-xs truncate w-full sm:w-auto">
                ID: <span className="font-semibold">{user._id.slice(-6)}</span>
              </div>

              {/* Name & Email */}
              <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                <div className="text-gray-700 text-sm font-medium truncate">
                  {user.name}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {user.email}
                </div>
              </div>

              {/* Phone & Address */}
              <div className="mt-2 sm:mt-0 w-full sm:w-auto text-gray-600 text-sm">
                <div>Phone: {user.phone || "-"}</div>
                <div>Address: {user.address || "-"}</div>
              </div>
            </div>

            {/* Right: Role Badge + Delete Button */}
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase
                ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : user.role === "agent"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.role}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(user._id)}
                disabled={deletingId === user._id}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition disabled:opacity-50"
              >
                {deletingId === user._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default UsersTable;
