import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "guest";

  const missions = db
    .prepare(
      `SELECT m.*,
        CASE WHEN eb.id IS NOT NULL THEN 1 ELSE 0 END as completed
      FROM missions m
      LEFT JOIN earned_badges eb ON eb.mission_id = m.id AND eb.user_id = ?`
    )
    .all(userId);

  return NextResponse.json(missions);
}
