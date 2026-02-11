"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--card)] cursor-pointer transition-colors hover:bg-[var(--secondary)] ${className}`}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="material-icons text-[18px] text-[var(--foreground)]">
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
