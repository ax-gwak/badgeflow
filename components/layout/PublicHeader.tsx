"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function PublicHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="w-full h-[64px] border-b border-[var(--border)] px-8 flex items-center justify-between bg-[var(--background)]">
      <span
        className="text-[var(--primary)] font-primary text-[18px] font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        BADGEFLOW
      </span>

      <nav className="flex gap-6">
        <a
          href="/profile/test-user"
          className="text-[var(--muted-foreground)] font-secondary text-[14px] hover:text-[var(--foreground)] transition-colors"
        >
          Profile
        </a>
        <a
          href="/test"
          className="text-[var(--muted-foreground)] font-secondary text-[14px] hover:text-[var(--foreground)] transition-colors"
        >
          Missions
        </a>
      </nav>

      {session ? (
        <button
          onClick={() => router.push("/dashboard")}
          className="border border-[var(--border)] rounded-[999px] h-[40px] px-4 text-[14px] font-primary font-medium bg-[var(--card)] cursor-pointer transition-opacity hover:opacity-80"
        >
          Dashboard
        </button>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="border border-[var(--border)] rounded-[999px] h-[40px] px-4 text-[14px] font-primary font-medium bg-[var(--card)] cursor-pointer transition-opacity hover:opacity-80"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
