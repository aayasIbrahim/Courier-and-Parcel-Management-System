import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "customer";
  phone?: string;
  address?: string;
}

interface UsersTableProps {
  users?: User[]; // Optional prop, later fetch from API
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  // Example static users (replace with API data)
  const [userList] = useState<User[]>(
    users || [
      { id: "1", name: "John Doe", email: "john@example.com", role: "customer", phone: "017XXXXXXXX", address: "Dhaka" },
      { id: "2", name: "Alice Admin", email: "alice@example.com", role: "admin", phone: "018XXXXXXXX", address: "Chittagong" },
      { id: "3", name: "Agent 1", email: "agent1@example.com", role: "agent", phone: "019XXXXXXXX", address: "Sylhet" },
    ]
  );

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
          {userList.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.id}</td>
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
