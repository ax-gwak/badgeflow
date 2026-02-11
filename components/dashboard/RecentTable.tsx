"use client";

import React from "react";
import { Label } from "@/components/ui/Label";

interface IssuanceRow {
  badge: string;
  recipient: string;
  email: string;
  status: "claimed" | "pending" | "expired";
  date: string;
}

interface RecentTableProps {
  data: IssuanceRow[];
}

const statusVariantMap: Record<IssuanceRow["status"], "success" | "orange" | "secondary"> = {
  claimed: "success",
  pending: "orange",
  expired: "secondary",
};

export function RecentTable({ data }: RecentTableProps) {
  return (
    <div className="w-full">
      <div className="flex items-center bg-[var(--muted)] h-[44px] border-b border-[var(--border)]">
        <div className="flex-1 px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
          Badge Name
        </div>
        <div className="flex-1 px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
          Recipient
        </div>
        <div className="w-[100px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
          Status
        </div>
        <div className="w-[100px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
          Date
        </div>
      </div>

      {data.map((row, index) => (
        <div
          key={index}
          className="flex items-center h-[44px] border-b border-[var(--border)]"
        >
          <div className="flex-1 px-3 font-secondary text-[13px] font-medium text-[var(--foreground)]">
            {row.badge}
          </div>
          <div className="flex-1 px-3 font-secondary text-[13px] text-[var(--muted-foreground)]">
            {row.recipient}
          </div>
          <div className="w-[100px] px-3">
            <Label variant={statusVariantMap[row.status]}>
              {row.status}
            </Label>
          </div>
          <div className="w-[100px] px-3 text-[13px] font-secondary text-[var(--muted-foreground)]">
            {row.date}
          </div>
        </div>
      ))}
    </div>
  );
}
