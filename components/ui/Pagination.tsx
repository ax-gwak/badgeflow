"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-[40px] px-4 rounded-[999px] flex items-center justify-center text-[14px] font-secondary cursor-pointer bg-transparent text-[var(--foreground)] transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-[40px] h-[40px] rounded-[999px] flex items-center justify-center text-[14px] font-secondary cursor-pointer transition-opacity hover:opacity-80 ${
            page === currentPage
              ? "bg-[var(--card)] border border-[var(--border)] shadow-sm text-[var(--foreground)]"
              : "bg-transparent text-[var(--muted-foreground)]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-[40px] px-4 rounded-[999px] flex items-center justify-center text-[14px] font-secondary cursor-pointer bg-transparent text-[var(--foreground)] transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
