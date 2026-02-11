"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DashboardData {
  metrics: { title: string; value: string; change: string; icon: string }[];
  recentIssuances: {
    badge: string;
    recipient: string;
    email: string;
    status: "claimed" | "pending" | "expired";
    date: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics ?? [
    { title: "Total Issued", value: "—", change: "", icon: "badge" },
    { title: "Claim Rate", value: "—", change: "", icon: "trending_up" },
    { title: "Active Badges", value: "—", change: "", icon: "verified" },
    { title: "On-Chain Verified", value: "—", change: "", icon: "share" },
  ];

  return (
    <AdminLayout activeItem="dashboard">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[24px] font-primary font-bold">{t("dashboard.title")}</h1>
            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              onClick={() => router.push("/badges/create")}
            >
              {t("dashboard.newBadge")}
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Recent Issuances */}
        <div className="mt-8">
          <Card
            header={
              <div className="flex justify-between items-center">
                <span className="text-[18px] font-primary font-bold">
                  {t("dashboard.recentIssuances")}
                </span>
                <Button
                  variant="outline"
                  onClick={() => router.push("/badges")}
                >
                  {t("dashboard.viewAll")}
                </Button>
              </div>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center h-[120px] text-[var(--muted-foreground)] font-secondary text-[14px]">
                {t("common.loading")}
              </div>
            ) : data?.recentIssuances.length ? (
              <RecentTable data={data.recentIssuances} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[120px] gap-2">
                <span className="material-icons text-[var(--muted-foreground)] text-[32px]">
                  inbox
                </span>
                <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
                  No badges issued yet. Complete a mission on the{" "}
                  <span
                    className="text-[var(--primary)] cursor-pointer"
                    onClick={() => router.push("/test")}
                  >
                    test page
                  </span>
                  .
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
