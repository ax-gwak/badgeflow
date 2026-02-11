"use client";

import React from "react";

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBox({
  placeholder = "Search...",
  className = "",
  value,
  onChange,
}: SearchBoxProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-[20px]">
        search
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-[40px] w-full rounded-[999px] border border-[var(--input)] bg-[var(--card)] pl-10 pr-4 text-[14px] font-secondary text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    </div>
  );
}
