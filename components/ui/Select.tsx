"use client";

import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: string[];
  className?: string;
}

export function Select({
  label,
  placeholder = "Select an option",
  options,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={ref}>
      {label && (
        <label className="text-[14px] font-medium font-secondary text-[var(--foreground)]">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-[40px] rounded-[999px] border border-[var(--input)] bg-[var(--card)] px-4 text-[14px] font-secondary text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] flex items-center justify-between cursor-pointer"
      >
        <span className={selected ? "" : "text-[var(--muted-foreground)]"}>
          {selected ?? placeholder}
        </span>
        <span className="material-icons text-[18px] text-[var(--muted-foreground)]">
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="relative">
          <ul className="absolute top-0 left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-[16px] shadow-md overflow-hidden z-10">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 text-[14px] font-secondary text-[var(--foreground)] cursor-pointer hover:bg-[var(--secondary)] transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
