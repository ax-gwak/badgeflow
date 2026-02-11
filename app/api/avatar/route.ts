import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "avatars");

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 2MB" }, { status: 400 });
  }

  // Ensure upload dir exists
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  // Save file
  const ext = file.name.split(".").pop() || "png";
  const filename = `${session.user.id}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  // Update DB
  const avatarUrl = `/avatars/${filename}`;
  db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(avatarUrl, session.user.id);

  return NextResponse.json({ avatar: avatarUrl });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = db
    .prepare("SELECT avatar FROM users WHERE id = ?")
    .get(session.user.id) as { avatar: string | null } | undefined;

  if (user?.avatar) {
    const filepath = path.join(process.cwd(), "public", user.avatar);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }

  db.prepare("UPDATE users SET avatar = NULL WHERE id = ?").run(session.user.id);
  return NextResponse.json({ success: true });
}
