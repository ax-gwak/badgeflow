import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(session.user.id) as { role: string } | undefined;
  if (!user || user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const users = db
    .prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
    .all() as DbUser[];

  // Attach badge count per user
  const result = users.map((u) => {
    const count = db
      .prepare("SELECT COUNT(*) as c FROM earned_badges WHERE user_id = ?")
      .get(u.id) as { c: number };
    return { ...u, badgeCount: count.c };
  });

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { userId, role } = await request.json();
  if (!userId || !role || !["admin", "user"].includes(role)) {
    return NextResponse.json({ error: "Invalid userId or role" }, { status: 400 });
  }

  // Prevent demoting self
  if (userId === session.user?.id && role !== "admin") {
    return NextResponse.json({ error: "Cannot demote yourself" }, { status: 400 });
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  // Prevent deleting self
  if (userId === session.user?.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  db.prepare("DELETE FROM earned_badges WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
  return NextResponse.json({ success: true });
}
