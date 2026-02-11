"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import type { Mission, EarnedBadge } from "@/lib/types";

export default function TestPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [missionsRes, badgesRes] = await Promise.all([
      fetch("/api/missions"),
      fetch("/api/earned-badges"),
    ]);
    setMissions(await missionsRes.json());
    setEarnedBadges(await badgesRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completeMission = async (missionId: string) => {
    setLoading(missionId);
    await fetch(`/api/missions/${missionId}/complete`, { method: "POST" });
    await fetchData();
    setLoading(null);
  };

  const copyShareUrl = (badgeId: string) => {
    const url = `${window.location.origin}/share/${badgeId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(badgeId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1000px] mx-auto p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-primary font-bold">
              Mission Test Page
            </h1>
            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-1">
              미션을 완료하면 뱃지가 자동으로 발급됩니다. 발급된 뱃지는 외부에
              공유할 수 있습니다.
            </p>
          </div>

          {/* Section 1: Missions */}
          <h2 className="text-[20px] font-primary font-bold mb-4">
            <span className="material-icons text-[var(--primary)] align-middle mr-2">
              flag
            </span>
            Available Missions
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] p-5 flex flex-col gap-3"
              >
                <div className="w-[48px] h-[48px] bg-[var(--muted)] rounded-full flex items-center justify-center">
                  <span className="material-icons text-[var(--muted-foreground)] text-[24px]">
                    {mission.icon}
                  </span>
                </div>
                <h3 className="text-[16px] font-primary font-bold">
                  {mission.title}
                </h3>
                <p className="text-[13px] text-[var(--muted-foreground)] font-secondary flex-1">
                  {mission.description}
                </p>
                <div className="flex items-center gap-2">
                  <Label variant="secondary">{mission.category}</Label>
                </div>
                {mission.completed ? (
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[var(--color-success-foreground)] text-[18px]">
                      check_circle
                    </span>
                    <Label variant="success">완료됨</Label>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => completeMission(mission.id)}
                    disabled={loading === mission.id}
                  >
                    {loading === mission.id ? "처리 중..." : "완료하기"}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Section 2: Earned Badges */}
          <h2 className="text-[20px] font-primary font-bold mb-4">
            <span className="material-icons text-[var(--primary)] align-middle mr-2">
              workspace_premium
            </span>
            Earned Badges
            {earnedBadges.length > 0 && (
              <span className="text-[14px] font-secondary text-[var(--muted-foreground)] font-normal ml-2">
                ({earnedBadges.length}개)
              </span>
            )}
          </h2>

          {earnedBadges.length === 0 ? (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] p-8 text-center">
              <span className="material-icons text-[48px] text-[var(--border)]">
                emoji_events
              </span>
              <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-2">
                아직 획득한 뱃지가 없습니다. 위의 미션을 완료해 보세요!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-[16px] overflow-hidden border border-[var(--border)]"
                >
                  <div
                    className="h-[120px] flex items-center justify-center"
                    style={{ backgroundColor: badge.badge_color }}
                  >
                    <span className="material-icons text-[48px] text-black/20">
                      {badge.badge_icon}
                    </span>
                  </div>
                  <div className="p-4 bg-[var(--card)] flex flex-col gap-2">
                    <p className="text-[16px] font-primary font-bold">
                      {badge.badge_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Label variant="secondary">{badge.category}</Label>
                      <span className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                        {formatDate(badge.earned_at)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-1"
                      onClick={() => copyShareUrl(badge.id)}
                    >
                      <span className="material-icons text-[16px]">
                        {copiedId === badge.id ? "check" : "share"}
                      </span>
                      {copiedId === badge.id ? "복사됨!" : "공유하기"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
