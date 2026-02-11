import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const badge = db.prepare("SELECT * FROM missions WHERE id = ?").get(id);
  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  // Delete earned badges first (foreign key)
  db.prepare("DELETE FROM earned_badges WHERE mission_id = ?").run(id);
  db.prepare("DELETE FROM missions WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
