"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeItem: "dashboard" | "badges" | "issuance" | "analytics" | "settings";
}

export function AdminLayout({ children, activeItem }: AdminLayoutProps) {
  return (
    <div className="flex h-full w-full">
      <Sidebar activeItem={activeItem} />
      <main className="flex-1 overflow-auto bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
