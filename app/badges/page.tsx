"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { SearchBox } from "@/components/ui/SearchBox";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import type { Mission } from "@/lib/types";

const categoryVariantMap: Record<string, "success" | "orange" | "violet" | "secondary"> = {
  "시험 인증": "orange",
  "책읽기 활동": "success",
  "학습 활동": "violet",
  "STEM": "secondary",
  "창작 활동": "violet",
  "체육 활동": "orange",
};

export default function BadgesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [badges, setBadges] = useState<Mission[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBadges = useCallback(async () => {
    const res = await fetch("/api/badges");
    if (res.ok) setBadges(await res.json());
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 뱃지를 삭제하시겠습니까?")) return;
    setDeleting(id);
    const res = await fetch(`/api/badges/${id}`, { method: "DELETE" });
    if (res.ok) await fetchBadges();
    setDeleting(null);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Dynamic category tabs
  const categories = ["All Badges", ...Array.from(new Set(badges.map((b) => b.category)))];
  const activeCategory = categories[activeTab] || "All Badges";

  // Filter by tab + search
  const filtered = badges.filter((b) => {
    // Category tab filter
    if (activeCategory !== "All Badges" && b.category !== activeCategory) return false;
    // Search filter
    const q = searchValue.toLowerCase();
    return (
      b.badge_name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.issuer.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout activeItem="badges">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[24px] font-primary font-bold">Badge Management</h1>
            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
              Create and manage your digital badges
            </p>
          </div>
          <Button variant="default" onClick={() => router.push("/badges/create")}>
            + Create Badge
          </Button>
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <Tabs
            items={categories}
            activeIndex={activeTab}
            onTabChange={(i) => setActiveTab(i)}
          />
          <SearchBox
            placeholder="Search..."
            className="w-[240px]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="mt-4">
          <Card>
            {/* Table Header */}
            <div className="flex items-center bg-[var(--muted)] h-[44px] border-b border-[var(--border)]">
              <span className="flex-[2] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                Badge Name
              </span>
              <span className="flex-1 px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                Category
              </span>
              <span className="flex-1 px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                Issuer
              </span>
              <span className="w-[120px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                Created
              </span>
              <span className="w-[60px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                Actions
              </span>
            </div>

            {/* Table Rows */}
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-[120px] text-[14px] text-[var(--muted-foreground)] font-secondary">
                {badges.length === 0 ? "등록된 뱃지가 없습니다" : "검색 결과가 없습니다"}
              </div>
            ) : (
              filtered.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center h-[52px] border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors"
                >
                  <span className="flex-[2] px-3 flex items-center gap-2">
                    <span
                      className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: badge.badge_color }}
                    >
                      <span className="material-icons text-[14px] text-black/30">
                        {badge.badge_icon}
                      </span>
                    </span>
                    <span className="text-[13px] font-secondary font-medium text-[var(--foreground)]">
                      {badge.badge_name}
                    </span>
                  </span>
                  <span className="flex-1 px-3">
                    <Label variant={categoryVariantMap[badge.category] || "secondary"}>
                      {badge.category}
                    </Label>
                  </span>
                  <span className="flex-1 px-3 text-[13px] font-secondary text-[var(--muted-foreground)]">
                    {badge.issuer}
                  </span>
                  <span className="w-[120px] px-3 text-[12px] font-secondary text-[var(--muted-foreground)]">
                    {formatDate(badge.created_at)}
                  </span>
                  <span className="w-[60px] px-3">
                    <button
                      className="material-icons text-[18px] text-[var(--muted-foreground)] hover:text-red-500 cursor-pointer transition-colors disabled:opacity-30"
                      onClick={() => handleDelete(badge.id)}
                      disabled={deleting === badge.id}
                      title="삭제"
                    >
                      delete_outline
                    </button>
                  </span>
                </div>
              ))
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-2 px-3 py-2">
              <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                총 {filtered.length}개 뱃지
              </span>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
