import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { registerBadgeOnChain } from "@/lib/blockchain";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || "guest";

  const { id } = await params;

  const mission = db.prepare("SELECT * FROM missions WHERE id = ?").get(id) as
    | Record<string, string>
    | undefined;
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const existing = db
    .prepare("SELECT id FROM earned_badges WHERE mission_id = ? AND user_id = ?")
    .get(id, userId);
  if (existing) {
    return NextResponse.json({ error: "Already completed" }, { status: 409 });
  }

  const badgeId = crypto.randomUUID();
  const earnedAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    badgeId,
    id,
    userId,
    mission.badge_name,
    mission.badge_color,
    mission.badge_icon,
    mission.category,
    earnedAt
  );

  // Blockchain registration (non-blocking failure)
  const chainResult = await registerBadgeOnChain({
    id: badgeId,
    mission_id: id,
    user_id: userId,
    badge_name: mission.badge_name,
    earned_at: earnedAt,
  });

  if (chainResult) {
    db.prepare(
      `UPDATE earned_badges SET tx_hash = ?, contract_address = ?, block_number = ? WHERE id = ?`
    ).run(
      chainResult.txHash,
      chainResult.contractAddress,
      chainResult.blockNumber,
      badgeId
    );
  }

  const badge = db.prepare("SELECT * FROM earned_badges WHERE id = ?").get(badgeId);
  return NextResponse.json(badge, { status: 201 });
}
