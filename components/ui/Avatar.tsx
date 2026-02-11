"use client";

import React from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-[32px] h-[32px] text-[12px]",
  md: "w-[40px] h-[40px] text-[14px]",
  lg: "w-[80px] h-[80px] text-[28px]",
};

export function Avatar({
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`rounded-[999px] font-primary font-semibold flex items-center justify-center bg-[var(--secondary)] text-[var(--secondary-foreground)] ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
