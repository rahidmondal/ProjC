import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxPageButtons = 3; // Number of page buttons to display before '...'

  // Generate page numbers with '...' when needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxPageButtons + 2) {
      // Show all pages if totalPages is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, and current range
      pages.push(1);
      if (currentPage > 2) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center border border-gray-400 space-x-2 mt-16 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? "border border-gray-600 dark:border-white"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
