"use client";

import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Label } from "@/components/ui/Label";
import { profileBadges, profileSkills } from "@/lib/mock-data";

const skillLevelVariant: Record<string, "success" | "violet" | "orange"> = {
  Advanced: "success",
  Intermediate: "violet",
  Beginner: "orange",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="py-8 px-8 border-b border-[var(--border)]">
          <div className="max-w-[1000px] mx-auto flex items-center gap-6">
            <Avatar initials="KM" size="lg" />

            <div className="flex-1">
              <h1 className="text-[24px] font-primary font-bold">Kim MinJi</h1>
              <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
                BadgeFlow Learning Center
              </p>
              <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-1">
                Pursuing excellence in digital learning, avid reader and creative
                thinker. Dedicated to continuous growth in all learning areas.
              </p>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">12</span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Badges
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">8</span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Earned
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">24</span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Shared
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8 px-8">
          <div className="max-w-[1000px] mx-auto flex gap-8">
            {/* Left - Badge Grid */}
            <div className="flex-1">
              <h2 className="text-[18px] font-primary font-bold">
                Earned Badges
              </h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {profileBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="rounded-[16px] overflow-hidden border border-[var(--border)]"
                  >
                    <div
                      className="h-[120px] flex items-center justify-center"
                      style={{ backgroundColor: badge.color }}
                    >
                      <span className="material-icons text-[40px] text-black/20">
                        workspace_premium
                      </span>
                    </div>
                    <div className="p-3 bg-[var(--card)]">
                      <p className="text-[14px] font-primary font-medium">
                        {badge.name}
                      </p>
                      <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                        {badge.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Skills */}
            <div className="w-[280px] shrink-0">
              <h2 className="text-[18px] font-primary font-bold">Top Skills</h2>
              <div className="flex flex-col gap-3 mt-4">
                {profileSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[14px] font-secondary text-[var(--foreground)]">
                      {skill.name}
                    </span>
                    <Label variant={skillLevelVariant[skill.level]}>
                      {skill.level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
