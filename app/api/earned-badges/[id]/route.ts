import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const badge = db.prepare("SELECT * FROM earned_badges WHERE id = ?").get(id);
  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  return NextResponse.json(badge);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(session.user.id) as { role: string } | undefined;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const badge = db.prepare("SELECT id FROM earned_badges WHERE id = ?").get(id);
  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  db.prepare("DELETE FROM earned_badges WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
