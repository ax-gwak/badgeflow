"use client";

import React from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  type = "text",
  className = "",
  value,
  onChange,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[14px] font-medium font-secondary text-[var(--foreground)]">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-[40px] rounded-[999px] border border-[var(--input)] bg-[var(--card)] px-4 text-[14px] font-secondary text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    </div>
  );
}
