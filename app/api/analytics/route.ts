import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // Badges by category
  const byCategory = db
    .prepare(
      `SELECT category, COUNT(*) as count FROM earned_badges GROUP BY category ORDER BY count DESC`
    )
    .all() as { category: string; count: number }[];

  // Daily issuances (last 14 days)
  const dailyIssuances = db
    .prepare(
      `SELECT DATE(earned_at) as date, COUNT(*) as count
       FROM earned_badges
       WHERE earned_at >= datetime('now', '-14 days')
       GROUP BY DATE(earned_at)
       ORDER BY date ASC`
    )
    .all() as { date: string; count: number }[];

  // Top missions
  const topMissions = db
    .prepare(
      `SELECT m.title, m.badge_name, m.category, COUNT(eb.id) as completions
       FROM missions m
       LEFT JOIN earned_badges eb ON eb.mission_id = m.id
       GROUP BY m.id
       ORDER BY completions DESC
       LIMIT 5`
    )
    .all() as { title: string; badge_name: string; category: string; completions: number }[];

  // Blockchain stats
  const totalBadges = db.prepare("SELECT COUNT(*) as c FROM earned_badges").get() as { c: number };
  const onChain = db.prepare("SELECT COUNT(*) as c FROM earned_badges WHERE tx_hash IS NOT NULL").get() as { c: number };
  const totalUsers = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  const totalMissions = db.prepare("SELECT COUNT(*) as c FROM missions").get() as { c: number };

  return NextResponse.json({
    byCategory,
    dailyIssuances,
    topMissions,
    summary: {
      totalBadges: totalBadges.c,
      onChain: onChain.c,
      totalUsers: totalUsers.c,
      totalMissions: totalMissions.c,
      onChainRate: totalBadges.c > 0 ? Math.round((onChain.c / totalBadges.c) * 100) : 0,
    },
  });
}
