"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { dashboardMetrics, recentIssuances } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AdminLayout activeItem="dashboard">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[24px] font-primary font-bold">Dashboard</h1>
            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
              Overview of your badge platform activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              placeholder="Last 30 Days"
              options={["Last 30 Days", "Last 7 Days", "Last 90 Days", "This Year"]}
            />
            <Button variant="default">+ New Badge</Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {dashboardMetrics.map((metric) => (
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
                  Recent Issuances
                </span>
                <Button variant="outline">View All</Button>
              </div>
            }
          >
            <RecentTable data={recentIssuances} />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
