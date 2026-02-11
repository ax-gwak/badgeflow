"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";

type ActiveItem = "dashboard" | "badges" | "issuance" | "analytics" | "settings";

interface SidebarProps {
  activeItem: ActiveItem;
}

interface NavItem {
  key: ActiveItem;
  label: string;
  icon: string;
}

const mainItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "badges", label: "Badge Management", icon: "verified" },
  { key: "issuance", label: "Issuance", icon: "send" },
];

const insightItems: NavItem[] = [
  { key: "analytics", label: "Analytics", icon: "bar_chart" },
  { key: "settings", label: "Settings", icon: "settings" },
];

export function Sidebar({ activeItem }: SidebarProps) {
  const renderItem = (item: NavItem) => {
    const isActive = activeItem === item.key;
    return (
      <div
        key={item.key}
        className={`flex items-center gap-3 text-[14px] font-secondary cursor-pointer mx-3 px-3 py-2 rounded-[999px] transition ${
          isActive
            ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
            : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/50"
        }`}
      >
        <span className="material-icons">{item.icon}</span>
        {item.label}
      </div>
    );
  };

  return (
    <aside className="w-[280px] h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col justify-between shrink-0">
      <div>
        <div className="px-6 py-6">
          <span className="text-[var(--primary)] font-primary text-[18px] font-bold">
            BADGEFLOW
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[12px] text-[var(--sidebar-foreground)] font-primary uppercase px-6 py-2">
            Main
          </div>
          {mainItems.map(renderItem)}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <div className="text-[12px] text-[var(--sidebar-foreground)] font-primary uppercase px-6 py-2">
            Insights
          </div>
          {insightItems.map(renderItem)}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[var(--sidebar-border)] flex items-center gap-3">
        <Avatar initials="AU" size="sm" />
        <div className="flex flex-col">
          <span className="text-[14px] font-secondary font-medium text-[var(--sidebar-accent-foreground)]">
            Admin User
          </span>
          <span className="text-[12px] font-secondary text-[var(--sidebar-foreground)]">
            admin@badgeflow.com
          </span>
        </div>
      </div>
    </aside>
  );
}
