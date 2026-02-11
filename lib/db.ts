import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "badgeflow.db");

function initDb(): Database.Database {
  if ((globalThis as Record<string, unknown>).__db) {
    return (globalThis as Record<string, unknown>).__db as Database.Database;
  }

  fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      category TEXT NOT NULL,
      issuer TEXT NOT NULL DEFAULT 'BadgeFlow',
      criteria TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS earned_badges (
      id TEXT PRIMARY KEY,
      mission_id TEXT NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'test-user',
      badge_name TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      category TEXT NOT NULL,
      earned_at TEXT NOT NULL,
      FOREIGN KEY (mission_id) REFERENCES missions(id)
    );
  `);

  // Migrate: add blockchain columns if they don't exist
  const columns = db
    .prepare("PRAGMA table_info(earned_badges)")
    .all() as { name: string }[];
  const columnNames = columns.map((c) => c.name);

  if (!columnNames.includes("tx_hash")) {
    db.exec("ALTER TABLE earned_badges ADD COLUMN tx_hash TEXT");
  }
  if (!columnNames.includes("contract_address")) {
    db.exec("ALTER TABLE earned_badges ADD COLUMN contract_address TEXT");
  }
  if (!columnNames.includes("block_number")) {
    db.exec("ALTER TABLE earned_badges ADD COLUMN block_number INTEGER");
  }

  // Seed default missions
  const insert = db.prepare(
    `INSERT OR IGNORE INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const now = new Date().toISOString();
  insert.run("mission-1", "책 10권 읽기", "10권의 책을 읽고 독서 마스터 뱃지를 획득하세요", "menu_book", "Reading Master", "#E8F5E9", "menu_book", "책읽기 활동", "BadgeFlow Education", "10권의 책을 읽고 독후감을 제출하면 인증됩니다", now);
  insert.run("mission-2", "학습 1주일 완료", "1주일 연속 학습을 완료하고 학습 챔피언 뱃지를 획득하세요", "school", "Learning Champion", "#E3F2FD", "school", "학습 활동", "BadgeFlow Academy", "7일 연속 학습 기록이 확인되면 인증됩니다", now);
  insert.run("mission-3", "한자검정시험 통과", "한자검정시험에 합격하고 한자 마스터 뱃지를 획득하세요", "translate", "Hanja Master", "#FFF3E0", "translate", "시험 인증", "한자검정시험위원회", "한자검정시험 합격증을 제출하면 인증됩니다", now);

  // Seed default admin user
  const hashedPassword = bcrypt.hashSync("admin1234", 10);
  db.prepare(
    "INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
  ).run("admin-1", "Admin User", "admin@badgeflow.com", hashedPassword, "admin");

  (globalThis as Record<string, unknown>).__db = db;
  return db;
}

export const db = initDb();
