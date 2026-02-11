"use client";

import React from "react";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  label,
  placeholder,
  className = "",
  value,
  onChange,
}: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[14px] font-medium font-secondary text-[var(--foreground)]">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="min-h-[80px] rounded-[16px] border border-[var(--input)] bg-[var(--card)] px-4 py-2 text-[14px] font-secondary text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    </div>
  );
}
