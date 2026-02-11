"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Label } from "@/components/ui/Label";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AnalyticsData {
  byCategory: { category: string; count: number }[];
  dailyIssuances: { date: string; count: number }[];
  topMissions: {
    title: string;
    badge_name: string;
    category: string;
    completions: number;
  }[];
  summary: {
    totalBadges: number;
    onChain: number;
    totalUsers: number;
    totalMissions: number;
    onChainRate: number;
  };
}

export default function AnalyticsPage() {
  const { t } = useLocale();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;
  const maxCategoryCount = data?.byCategory?.[0]?.count ?? 1;
  const maxDailyCount = Math.max(...(data?.dailyIssuances?.map((d) => d.count) ?? [1]));

  return (
    <AdminLayout activeItem="analytics">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-[24px] font-primary font-bold">{t("analytics.title")}</h1>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
            {t("analytics.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[200px] text-[var(--muted-foreground)] font-secondary text-[14px]">
            Loading analytics...
          </div>
        ) : !data ? (
          <div className="flex items-center justify-center h-[200px] text-[var(--muted-foreground)] font-secondary text-[14px]">
            Failed to load analytics data.
          </div>
        ) : (
          <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <MetricCard
                title="Total Badges"
                value={String(summary?.totalBadges ?? 0)}
                change=""
                icon="verified"
              />
              <MetricCard
                title="On-Chain Rate"
                value={`${summary?.onChainRate ?? 0}%`}
                change={`${summary?.onChain ?? 0} verified`}
                icon="link"
              />
              <MetricCard
                title="Total Users"
                value={String(summary?.totalUsers ?? 0)}
                change=""
                icon="people"
              />
              <MetricCard
                title="Total Missions"
                value={String(summary?.totalMissions ?? 0)}
                change=""
                icon="flag"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              {/* Category Breakdown */}
              <Card
                header={
                  <span className="text-[16px] font-primary font-bold">
                    Badges by Category
                  </span>
                }
              >
                {data.byCategory.length === 0 ? (
                  <p className="text-[14px] text-[var(--muted-foreground)] font-secondary py-4">
                    No badges issued yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {data.byCategory.map((cat) => (
                      <div key={cat.category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[13px] font-secondary text-[var(--foreground)]">
                            {cat.category}
                          </span>
                          <span className="text-[13px] font-secondary text-[var(--muted-foreground)]">
                            {cat.count}
                          </span>
                        </div>
                        <div className="w-full h-[8px] bg-[var(--secondary)] rounded-[4px] overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] rounded-[4px] transition-all"
                            style={{
                              width: `${(cat.count / maxCategoryCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Daily Issuances */}
              <Card
                header={
                  <span className="text-[16px] font-primary font-bold">
                    Daily Issuances (14 days)
                  </span>
                }
              >
                {data.dailyIssuances.length === 0 ? (
                  <p className="text-[14px] text-[var(--muted-foreground)] font-secondary py-4">
                    No recent issuances.
                  </p>
                ) : (
                  <div className="flex items-end gap-1 h-[140px]">
                    {data.dailyIssuances.map((day) => (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] font-secondary text-[var(--muted-foreground)]">
                          {day.count}
                        </span>
                        <div
                          className="w-full bg-[var(--primary)] rounded-t-[3px] min-h-[4px] transition-all"
                          style={{
                            height: `${(day.count / maxDailyCount) * 100}px`,
                          }}
                        />
                        <span className="text-[9px] font-secondary text-[var(--muted-foreground)] whitespace-nowrap">
                          {new Date(day.date).toLocaleDateString("en", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Top Missions */}
            <div className="mt-6">
              <Card
                header={
                  <span className="text-[16px] font-primary font-bold">
                    Top Missions
                  </span>
                }
              >
                {data.topMissions.length === 0 ? (
                  <p className="text-[14px] text-[var(--muted-foreground)] font-secondary py-4">
                    No missions created yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th className="text-left text-[12px] text-[var(--muted-foreground)] font-secondary font-normal pb-2">
                            Mission
                          </th>
                          <th className="text-left text-[12px] text-[var(--muted-foreground)] font-secondary font-normal pb-2">
                            Badge
                          </th>
                          <th className="text-left text-[12px] text-[var(--muted-foreground)] font-secondary font-normal pb-2">
                            Category
                          </th>
                          <th className="text-right text-[12px] text-[var(--muted-foreground)] font-secondary font-normal pb-2">
                            Completions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topMissions.map((mission, i) => (
                          <tr
                            key={i}
                            className="border-b border-[var(--border)] last:border-0"
                          >
                            <td className="py-3 text-[14px] font-secondary text-[var(--foreground)]">
                              {mission.title}
                            </td>
                            <td className="py-3 text-[14px] font-secondary text-[var(--muted-foreground)]">
                              {mission.badge_name}
                            </td>
                            <td className="py-3">
                              <Label variant="secondary">
                                {mission.category}
                              </Label>
                            </td>
                            <td className="py-3 text-right text-[14px] font-primary font-bold">
                              {mission.completions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
