"use client";

import React from "react";

export function PublicHeader() {
  return (
    <header className="w-full h-[64px] border-b border-[var(--border)] px-8 flex items-center justify-between bg-[var(--background)]">
      <span className="text-[var(--primary)] font-primary text-[18px] font-bold">
        BADGEFLOW
      </span>

      <nav className="flex gap-6">
        <a
          href="#"
          className="text-[var(--muted-foreground)] font-secondary text-[14px]"
        >
          Explore Badges
        </a>
        <a
          href="#"
          className="text-[var(--muted-foreground)] font-secondary text-[14px]"
        >
          Issuers
        </a>
        <a
          href="#"
          className="text-[var(--muted-foreground)] font-secondary text-[14px]"
        >
          About
        </a>
      </nav>

      <button className="border border-[var(--border)] rounded-[999px] h-[40px] px-4 text-[14px] font-primary font-medium bg-[var(--card)] cursor-pointer transition-opacity hover:opacity-80">
        Sign In
      </button>
    </header>
  );
}
