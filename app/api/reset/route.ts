import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE earned badges for the current user (missions stay intact)
export async function POST() {
  const session = await auth();
  const userId = session?.user?.id || "guest";

  db.prepare("DELETE FROM earned_badges WHERE user_id = ?").run(userId);

  return NextResponse.json({ success: true });
}
