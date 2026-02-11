"use client";

import React from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "destructive";
type ButtonSize = "default" | "large";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[var(--primary)] text-[var(--primary-foreground)]",
  outline:
    "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] shadow-sm",
  ghost: "bg-transparent text-[var(--foreground)]",
  secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  destructive: "bg-[var(--destructive)] text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-[40px] px-4 text-[14px]",
  large: "h-[48px] px-6 text-[16px]",
};

export function Button({
  variant = "default",
  size = "default",
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-[999px] font-primary font-medium cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
