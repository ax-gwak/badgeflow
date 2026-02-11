"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-2">
      <div className="bg-[var(--muted)] w-[40px] h-[40px] rounded-full flex items-center justify-center">
        <span className="material-icons text-[var(--muted-foreground)]">
          {icon}
        </span>
      </div>
      <span className="text-[28px] font-primary font-bold text-[var(--foreground)]">
        {value}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-secondary text-[var(--muted-foreground)]">
          {title}
        </span>
        <span className="text-[13px] font-secondary text-[var(--color-success-foreground)]">
          {change}
        </span>
      </div>
    </div>
  );
}
