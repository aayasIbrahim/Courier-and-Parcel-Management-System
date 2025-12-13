"use client";

import { useEffect, useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface Parcel {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  type: string;
  status: string;
  agent?: Agent;
}

/* ---------------- PAGE ---------------- */
export default function AssignAgentsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  /* -------- FETCH DATA -------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcelRes, agentRes] = await Promise.all([
          fetch("/api/parcels?status=Booked", { credentials: "include" }),
          fetch("/api/users?role=agent", { credentials: "include" }),
        ]);

        const parcelData = await parcelRes.json();
        const agentData = await agentRes.json();

        setParcels(parcelData.parcels || parcelData);
        setAgents(agentData.users || agentData);
      } catch {
        setMessage("Failed to load parcels or agents");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* -------- ASSIGN AGENT -------- */
  const assignAgent = async (parcelId: string, agentId: string) => {
    setAssigningId(parcelId);
    setMessage("");

    try {
      const res = await fetch(`/api/parcels/${parcelId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ agentId }),
      });

      if (!res.ok) throw new Error();

      const updatedParcel: Parcel = await res.json();

      setParcels((prev) =>
        prev.map((p) => (p._id === parcelId ? updatedParcel : p))
      );

      setMessage("Agent assigned successfully ✅");
    } catch {
      setMessage("Failed to assign agent ❌");
    } finally {
      setAssigningId(null);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Assign Agents</h1>
      </div>

      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded">
          {message}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading data...
        </div>
      )}

      {/* ---------------- DESKTOP TABLE ---------------- */}
      {!loading && parcels.length > 0 && (
        <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Parcel ID</th>
                <th className="p-3 text-left">Route</th>
                <th className="p-3 text-left">Agent</th>
                <th className="p-3 text-left">Assign</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3 font-mono text-xs">{p._id}</td>

                  <td className="p-3 text-xs">
                    {p.pickupAddress} → {p.deliveryAddress}
                  </td>

                  <td className="p-3 text-xs">
                    {p.agent ? (
                      <span className="text-green-600 font-medium">
                        {p.agent.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>

                  <td className="p-3">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      disabled={assigningId === p._id}
                      defaultValue=""
                      onChange={(e) =>
                        assignAgent(p._id, e.target.value)
                      }
                    >
                      <option value="">Select Agent</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.email})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- MOBILE CARDS ---------------- */}
      {!loading && parcels.length > 0 && (
        <div className="md:hidden space-y-4">
          {parcels.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded shadow p-4 space-y-3"
            >
              <div className="text-xs font-mono">{p._id}</div>

              <div className="text-xs text-gray-600">
                {p.pickupAddress} → {p.deliveryAddress}
              </div>

              {p.agent && (
                <div className="text-xs text-green-600">
                  Assigned to: {p.agent.name}
                </div>
              )}

              <select
                className="w-full border rounded px-3 py-2 text-sm"
                disabled={assigningId === p._id}
                defaultValue=""
                onChange={(e) =>
                  assignAgent(p._id, e.target.value)
                }
              >
                <option value="">Assign Agent</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {!loading && parcels.length === 0 && (
        <p className="text-gray-500">
          No parcels waiting for assignment.
        </p>
      )}
    </div>
  );
}
