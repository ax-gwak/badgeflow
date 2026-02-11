"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeItem: "dashboard" | "badges" | "issuance" | "analytics" | "settings" | "users";
}

export function AdminLayout({ children, activeItem }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar activeItem={activeItem} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[var(--background)] min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="material-icons text-[24px] text-[var(--foreground)] cursor-pointer"
          >
            menu
          </button>
          <span className="text-[var(--primary)] font-primary text-[16px] font-bold">
            BADGEFLOW
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
