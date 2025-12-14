"use client";

import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "customer";
  phone?: string;
  address?: string;
}

interface UsersTableProps {
  roleFilter?: "admin" | "agent" | "customer"; // Optional role filter
}

const UsersTable: React.FC<UsersTableProps> = ({ roleFilter }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = "/api/users";
        if (roleFilter) url += `?role=${roleFilter}`;

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data.users || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  if (loading) return <p className="text-gray-500 p-4">Loading users...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (users.length === 0) return <p className="text-gray-500 p-4">No users found.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Phone</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2">{user._id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2">{user.phone || "-"}</td>
              <td className="px-4 py-2">{user.address || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
