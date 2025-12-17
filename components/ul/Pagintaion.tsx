"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null; // hide pagination if only 1 page

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page > 2) pages.push(1, "...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 1) pages.push("...", totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex flex-wrap justify-center items-center gap-2 mt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-full min-w-[32px] text-center transition ${
              p === page
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2 py-1 text-gray-500 select-none">
            {p}
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
