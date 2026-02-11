"use client";

import React from "react";

type LabelVariant = "success" | "orange" | "violet" | "secondary";

interface LabelProps {
  variant?: LabelVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<LabelVariant, string> = {
  success: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
  orange: "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]",
  violet: "bg-[var(--color-info)] text-[var(--color-info-foreground)]",
  secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
};

export function Label({
  variant = "success",
  children,
  className = "",
}: LabelProps) {
  return (
    <span
      className={`rounded-[999px] px-2 py-1 text-[14px] font-primary inline-flex items-center justify-center ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
