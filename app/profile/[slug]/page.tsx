import { db } from "@/lib/db";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Label } from "@/components/ui/Label";
import type { EarnedBadge } from "@/lib/types";

const skillLevelVariant: Record<string, "success" | "violet" | "orange"> = {
  Advanced: "success",
  Intermediate: "violet",
  Beginner: "orange",
};

function getSkillLevel(count: number): string {
  if (count >= 3) return "Advanced";
  if (count >= 2) return "Intermediate";
  return "Beginner";
}

export default async function ProfilePage() {
  const badges = db
    .prepare(
      "SELECT * FROM earned_badges WHERE user_id = ? ORDER BY earned_at DESC"
    )
    .all("test-user") as EarnedBadge[];

  const totalBadges = badges.length;
  const onChainCount = badges.filter((b) => b.tx_hash).length;

  // Derive skills from badge categories
  const categoryCount: Record<string, number> = {};
  for (const badge of badges) {
    categoryCount[badge.category] = (categoryCount[badge.category] || 0) + 1;
  }
  const skills = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, level: getSkillLevel(count) }))
    .sort((a, b) => {
      const order = { Advanced: 0, Intermediate: 1, Beginner: 2 };
      return (
        (order[a.level as keyof typeof order] ?? 3) -
        (order[b.level as keyof typeof order] ?? 3)
      );
    });

  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="py-8 px-8 border-b border-[var(--border)]">
          <div className="max-w-[1000px] mx-auto flex items-center gap-6">
            <Avatar initials="TU" size="lg" />

            <div className="flex-1">
              <h1 className="text-[24px] font-primary font-bold">Test User</h1>
              <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
                BadgeFlow Learning Center
              </p>
              <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-1">
                Pursuing excellence in digital learning and earning verified
                badges through the BadgeFlow platform.
              </p>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">
                  {totalBadges}
                </span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Badges
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">
                  {onChainCount}
                </span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Verified
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-primary font-bold">
                  {Object.keys(categoryCount).length}
                </span>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  Skills
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
              {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] gap-2 mt-4 border border-[var(--border)] rounded-[16px]">
                  <span className="material-icons text-[var(--muted-foreground)] text-[40px]">
                    emoji_events
                  </span>
                  <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
                    No badges earned yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {badges.map((badge) => (
                    <a
                      key={badge.id}
                      href={`/share/${badge.id}`}
                      className="rounded-[16px] overflow-hidden border border-[var(--border)] hover:shadow-md transition-shadow"
                    >
                      <div
                        className="h-[120px] flex items-center justify-center"
                        style={{ backgroundColor: badge.badge_color }}
                      >
                        <span className="material-icons text-[40px] text-black/20">
                          {badge.badge_icon}
                        </span>
                      </div>
                      <div className="p-3 bg-[var(--card)]">
                        <p className="text-[14px] font-primary font-medium">
                          {badge.badge_name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                            {badge.category}
                          </p>
                          {badge.tx_hash && (
                            <span className="material-icons text-[14px] text-[var(--color-success-foreground)]">
                              verified
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Skills */}
            <div className="w-[280px] shrink-0">
              <h2 className="text-[18px] font-primary font-bold">
                Top Skills
              </h2>
              {skills.length === 0 ? (
                <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-4">
                  Earn badges to unlock skills
                </p>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  {skills.map((skill) => (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
