import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Label } from "@/components/ui/Label";
import { ClaimActions } from "@/components/ui/ClaimActions";
import type { EarnedBadge } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const badge = db
    .prepare("SELECT * FROM earned_badges WHERE id = ?")
    .get(id) as EarnedBadge | undefined;
  if (!badge) return {};
  return {
    title: `Claim: ${badge.badge_name} - BadgeFlow`,
    description: `Claim your ${badge.badge_name} badge earned through ${badge.category}.`,
  };
}

export default async function BadgeClaimPage({ params }: PageProps) {
  const { id } = await params;
  const badge = db
    .prepare("SELECT * FROM earned_badges WHERE id = ?")
    .get(id) as EarnedBadge | undefined;

  if (!badge) notFound();

  const earnedDate = new Date(badge.earned_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const credentialId = badge.id.slice(0, 8).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[900px] w-full">
          {/* Left Column - Badge Image */}
          <div className="w-full md:w-[280px] shrink-0 flex flex-col items-center">
            <div
              className="w-[240px] h-[240px] rounded-[24px] flex items-center justify-center"
              style={{ backgroundColor: badge.badge_color }}
            >
              <span className="material-icons text-[80px] text-black/20">
                {badge.badge_icon}
              </span>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[14px] font-primary font-bold text-[var(--foreground)] tracking-wider uppercase">
                {badge.category}
              </p>
              <p className="text-[13px] text-[var(--muted-foreground)] font-secondary mt-1">
                Issued by BadgeFlow
              </p>
            </div>
          </div>

          {/* Right Column - Badge Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2">
              {badge.tx_hash ? (
                <>
                  <span className="material-icons text-[var(--color-success-foreground)] text-[18px]">
                    verified
                  </span>
                  <span className="text-[13px] font-secondary text-[var(--color-success-foreground)]">
                    Blockchain Verified
                  </span>
                </>
              ) : (
                <>
                  <span className="material-icons text-[var(--muted-foreground)] text-[18px]">
                    verified
                  </span>
                  <span className="text-[13px] font-secondary text-[var(--muted-foreground)]">
                    Verified Issuer
                  </span>
                </>
              )}
            </div>

            <h1 className="text-[28px] font-primary font-bold mt-2">
              {badge.badge_name}
            </h1>

            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary leading-relaxed mt-3">
              This digital badge confirms the holder&apos;s achievement in the{" "}
              {badge.category} category. Earned through completing the required
              mission on the BadgeFlow platform.
            </p>

            {/* Category */}
            <div className="mt-6">
              <h3 className="text-[14px] font-primary font-bold">Category</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Label variant="secondary">{badge.category}</Label>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Earned Date
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  {earnedDate}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Credential ID
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  {credentialId}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Issuer
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  BadgeFlow
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <ClaimActions badgeId={badge.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
