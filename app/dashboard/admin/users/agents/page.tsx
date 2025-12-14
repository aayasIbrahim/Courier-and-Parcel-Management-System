"use client";

import { useEffect, useState } from "react";
import { UserCheck, Loader2 } from "lucide-react";

interface Agent {
  _id: string;
  name: string;
  email: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/users/agents", {
          credentials: "include",
        });

        const data = await res.json();
        setAgents(data?.users ?? []);
      } catch {
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-semibold">Delivery Agents</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading agents...
        </div>
      )}

      {/* Desktop Table */}
      {!loading && agents.length > 0 && (
        <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && agents.length > 0 && (
        <div className="md:hidden space-y-4">
          {agents.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded shadow p-4"
            >
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm text-gray-600">{a.email}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && agents.length === 0 && (
        <p className="text-gray-500">No agents found.</p>
      )}
    </div>
  );
}
