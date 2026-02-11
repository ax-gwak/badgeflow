"use client";

import React from "react";

interface TabsProps {
  items: string[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  className?: string;
}

export function Tabs({
  items,
  activeIndex,
  onTabChange,
  className = "",
}: TabsProps) {
  return (
    <div className={`flex gap-0 border-b border-[var(--border)] ${className}`}>
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          onClick={() => onTabChange(index)}
          className={`px-4 py-2.5 text-[14px] font-secondary cursor-pointer transition-colors ${
            index === activeIndex
              ? "text-[var(--foreground)] border-b-2 border-[var(--foreground)] font-medium"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
