import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const badges = db
    .prepare("SELECT * FROM earned_badges WHERE user_id = ? ORDER BY earned_at DESC")
    .all("test-user");

  return NextResponse.json(badges);
}
