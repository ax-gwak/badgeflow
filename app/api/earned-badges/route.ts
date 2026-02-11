import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "guest";

  const badges = db
    .prepare("SELECT * FROM earned_badges WHERE user_id = ? ORDER BY earned_at DESC")
    .all(userId);

  return NextResponse.json(badges);
}
