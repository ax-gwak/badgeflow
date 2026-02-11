import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { BlockchainBadge } from "@/components/ui/BlockchainBadge";
import type { EarnedBadge } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const badge = db.prepare("SELECT * FROM earned_badges WHERE id = ?").get(id) as EarnedBadge | undefined;
  if (!badge) return {};
  return {
    title: `${badge.badge_name} - BadgeFlow`,
    description: `Digital badge earned for ${badge.category}. Issued by BadgeFlow.`,
  };
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const badge = db.prepare("SELECT * FROM earned_badges WHERE id = ?").get(id) as EarnedBadge | undefined;
  if (!badge) notFound();

  const earnedDate = new Date(badge.earned_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex gap-12 max-w-[900px] w-full">
          {/* Left Column - Badge Visual */}
          <div className="w-[280px] shrink-0 flex flex-col items-center">
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
              <span className="material-icons text-[var(--color-success-foreground)] text-[18px]">
                verified
              </span>
              <span className="text-[13px] font-secondary text-[var(--color-success-foreground)]">
                Verified Badge
              </span>
            </div>

            <h1 className="text-[28px] font-primary font-bold mt-2">
              {badge.badge_name}
            </h1>

            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary leading-relaxed mt-3">
              This digital badge was earned by completing the mission
              requirements. It verifies the holder&apos;s achievement in the{" "}
              {badge.category} category through the BadgeFlow platform.
            </p>

            {/* Category */}
            <div className="mt-6">
              <h3 className="text-[14px] font-primary font-bold">Category</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="rounded-[999px] px-2 py-1 text-[14px] font-primary inline-flex items-center justify-center bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                  {badge.category}
                </span>
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
                  {badge.id.slice(0, 8).toUpperCase()}
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

            {/* Blockchain Verification */}
            <BlockchainBadge
              badgeId={badge.id}
              txHash={badge.tx_hash}
              contractAddress={badge.contract_address}
              blockNumber={badge.block_number}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
