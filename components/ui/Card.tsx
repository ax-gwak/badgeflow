"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  children,
  className = "",
  header,
  footer,
}: CardProps) {
  return (
    <div
      className={`bg-[var(--card)] rounded-none border border-[var(--border)] shadow-sm overflow-hidden ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-[var(--border)]">
          {header}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-[var(--border)]">
          {footer}
        </div>
      )}
    </div>
  );
}
