"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";

type ActiveItem = "dashboard" | "badges" | "issuance" | "analytics" | "settings";

interface SidebarProps {
  activeItem: ActiveItem;
  onClose?: () => void;
}

interface NavItem {
  key: ActiveItem;
  label: string;
  icon: string;
  href: string;
}

const mainItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { key: "badges", label: "Badge Management", icon: "verified", href: "/badges" },
  { key: "issuance", label: "Issuance", icon: "send", href: "/test" },
];

const insightItems: NavItem[] = [
  { key: "analytics", label: "Analytics", icon: "bar_chart", href: "/analytics" },
  { key: "settings", label: "Settings", icon: "settings", href: "/settings" },
];

export function Sidebar({ activeItem, onClose }: SidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const userName = session?.user?.name ?? "Admin User";
  const userEmail = session?.user?.email ?? "admin@badgeflow.com";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const renderItem = (item: NavItem) => {
    const isActive = activeItem === item.key;
    return (
      <div
        key={item.key}
        onClick={() => { router.push(item.href); onClose?.(); }}
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
          <span
            className="text-[var(--primary)] font-primary text-[18px] font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
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
        <Avatar initials={initials} size="sm" />
        <div className="flex flex-col flex-1">
          <span className="text-[14px] font-secondary font-medium text-[var(--sidebar-accent-foreground)]">
            {userName}
          </span>
          <span className="text-[12px] font-secondary text-[var(--sidebar-foreground)]">
            {userEmail}
          </span>
        </div>
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="material-icons text-[18px] text-[var(--sidebar-foreground)] hover:text-[var(--sidebar-accent-foreground)] cursor-pointer transition-colors"
            title="Sign out"
          >
            logout
          </button>
        )}
      </div>
    </aside>
  );
}
