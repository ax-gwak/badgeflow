import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Category → icon/color mapping
const categoryMap: Record<string, { icon: string; color: string }> = {
  "시험 인증": { icon: "quiz", color: "#FFF3E0" },
  "책읽기 활동": { icon: "menu_book", color: "#E8F5E9" },
  "학습 활동": { icon: "school", color: "#E3F2FD" },
  "STEM": { icon: "science", color: "#E0F2F1" },
  "창작 활동": { icon: "brush", color: "#F3E5F5" },
  "체육 활동": { icon: "fitness_center", color: "#FCE4EC" },
};

export async function GET() {
  const badges = db
    .prepare("SELECT * FROM missions ORDER BY created_at DESC")
    .all();
  return NextResponse.json(badges);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { badge_name, category, description, issuer, criteria } = body;

  if (!badge_name || !category || !description) {
    return NextResponse.json(
      { error: "badge_name, category, description are required" },
      { status: 400 }
    );
  }

  const id = `badge-${crypto.randomUUID().slice(0, 8)}`;
  const mapping = categoryMap[category] || { icon: "workspace_premium", color: "#E7E8E5" };

  db.prepare(
    `INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    badge_name,
    description,
    mapping.icon,
    badge_name,
    mapping.color,
    mapping.icon,
    category,
    issuer || "BadgeFlow",
    criteria || "",
    new Date().toISOString()
  );

  const badge = db.prepare("SELECT * FROM missions WHERE id = ?").get(id);
  return NextResponse.json(badge, { status: 201 });
}
