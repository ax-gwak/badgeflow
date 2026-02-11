"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { LOCALES } from "@/lib/i18n";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as "ko" | "en")}
      className={`h-[36px] px-2 border border-[var(--border)] rounded-[8px] bg-[var(--card)] text-[13px] font-secondary text-[var(--foreground)] cursor-pointer outline-none ${className}`}
    >
      {LOCALES.map((l) => (
        <option key={l.key} value={l.key}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
