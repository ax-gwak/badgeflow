import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // Total issued badges
  const totalIssued = db
    .prepare("SELECT COUNT(*) as count FROM earned_badges")
    .get() as { count: number };

  // Active badges (registered missions)
  const activeBadges = db
    .prepare("SELECT COUNT(*) as count FROM missions")
    .get() as { count: number };

  // Blockchain verified count
  const verified = db
    .prepare("SELECT COUNT(*) as count FROM earned_badges WHERE tx_hash IS NOT NULL")
    .get() as { count: number };

  // Shared (badges with blockchain records = shareable)
  const shared = verified.count;

  // Claim rate
  const claimRate =
    activeBadges.count > 0
      ? Math.round((totalIssued.count / activeBadges.count) * 100)
      : 0;

  const metrics = [
    { title: "Total Issued", value: String(totalIssued.count), change: "Live", icon: "badge" },
    { title: "Claim Rate", value: `${claimRate}%`, change: `${activeBadges.count} missions`, icon: "trending_up" },
    { title: "Active Badges", value: String(activeBadges.count), change: "Registered", icon: "verified" },
    { title: "On-Chain Verified", value: String(shared), change: "Blockchain", icon: "share" },
  ];

  // Recent issuances
  const recentIssuances = db
    .prepare(`
      SELECT
        eb.id,
        eb.badge_name,
        eb.user_id,
        eb.category,
        eb.earned_at,
        eb.tx_hash,
        m.title as mission_title
      FROM earned_badges eb
      LEFT JOIN missions m ON eb.mission_id = m.id
      ORDER BY eb.earned_at DESC
      LIMIT 10
    `)
    .all() as {
      id: string;
      badge_name: string;
      user_id: string;
      category: string;
      earned_at: string;
      tx_hash: string | null;
      mission_title: string | null;
    }[];

  const rows = recentIssuances.map((row) => ({
    badge: row.badge_name,
    recipient: row.user_id === "test-user" ? "Test User" : row.user_id,
    email: `${row.user_id}@badgeflow.io`,
    status: (row.tx_hash ? "claimed" : "pending") as "claimed" | "pending",
    date: new Date(row.earned_at).toLocaleDateString("en-CA"),
  }));

  return NextResponse.json({ metrics, recentIssuances: rows });
}
