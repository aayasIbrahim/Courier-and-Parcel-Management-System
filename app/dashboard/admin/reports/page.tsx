"use client";

import { useEffect, useState } from "react";
import { FileText, Download, BarChart3 } from "lucide-react";
import SummaryCard from "@/components/ul/SummaryCard";

interface ReportSummary {
  totalParcels: number;
  booked: number;
  inTransit: number;
  delivered: number;
  failed: number;
}

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/reports", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch report");

        const data = await res.json();
        setSummary(data);
      } catch {
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);
  console.log(summary);
 console.log("SUMMARY:", summary?.totalParcels);
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Reports</h1>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-sm">Loading reports...</p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard
            title="Total"
            value={summary.totalParcels}
            color="bg-blue-600"
          />
          <SummaryCard
            title="Booked"
            value={summary.booked}
            color="bg-gray-600"
          />
          <SummaryCard
            title="In Transit"
            value={summary.inTransit}
            color="bg-yellow-500"
          />
          <SummaryCard
            title="Delivered"
            value={summary.delivered}
            color="bg-green-600"
          />
          <SummaryCard
            title="Failed"
            value={summary.failed}
            color="bg-red-600"
          />
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded shadow p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold">Export Reports</h2>
        </div>

        <p className="text-sm text-gray-500">
          Download parcel reports for record keeping or analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/api/reports/export-csv"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>

         
        </div>
      </div>
    </div>
  );
}
