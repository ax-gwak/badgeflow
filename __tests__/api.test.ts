import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const TEST_DB_PATH = path.join(process.cwd(), "data", "test-api.db");

function setupTestDb(): Database.Database {
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);

  const db = new Database(TEST_DB_PATH);
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
      user_id TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      category TEXT NOT NULL,
      earned_at TEXT NOT NULL,
      tx_hash TEXT,
      contract_address TEXT,
      block_number INTEGER,
      FOREIGN KEY (mission_id) REFERENCES missions(id)
    );
  `);

  return db;
}

describe("API Logic - Analytics", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = setupTestDb();

    // Seed data
    const now = new Date().toISOString();
    const hash = bcrypt.hashSync("pass", 10);

    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u1", "Alice", "alice@test.com", hash, "user");
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u2", "Bob", "bob@test.com", hash, "user");

    db.prepare(
      "INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("m1", "Reading", "Read books", "book", "Reader", "#E8F5E9", "book", "Education", "BF", "Read 10 books", now);
    db.prepare(
      "INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("m2", "Coding", "Code projects", "code", "Coder", "#E3F2FD", "code", "Tech", "BF", "Build 5 projects", now);

    // Earned badges
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at, tx_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb1", "m1", "u1", "Reader", "#E8F5E9", "book", "Education", now, "0xabc");
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb2", "m2", "u1", "Coder", "#E3F2FD", "code", "Tech", now);
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at, tx_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb3", "m1", "u2", "Reader", "#E8F5E9", "book", "Education", now, "0xdef");
  });

  it("should calculate badges by category correctly", () => {
    const byCategory = db
      .prepare(
        "SELECT category, COUNT(*) as count FROM earned_badges GROUP BY category ORDER BY count DESC"
      )
      .all() as { category: string; count: number }[];

    expect(byCategory).toHaveLength(2);
    expect(byCategory[0].category).toBe("Education");
    expect(byCategory[0].count).toBe(2);
    expect(byCategory[1].category).toBe("Tech");
    expect(byCategory[1].count).toBe(1);
  });

  it("should calculate summary stats correctly", () => {
    const totalBadges = db
      .prepare("SELECT COUNT(*) as c FROM earned_badges")
      .get() as { c: number };
    const onChain = db
      .prepare(
        "SELECT COUNT(*) as c FROM earned_badges WHERE tx_hash IS NOT NULL"
      )
      .get() as { c: number };
    const totalUsers = db
      .prepare("SELECT COUNT(*) as c FROM users")
      .get() as { c: number };
    const totalMissions = db
      .prepare("SELECT COUNT(*) as c FROM missions")
      .get() as { c: number };

    expect(totalBadges.c).toBe(3);
    expect(onChain.c).toBe(2);
    expect(totalUsers.c).toBe(2);
    expect(totalMissions.c).toBe(2);

    const onChainRate =
      totalBadges.c > 0
        ? Math.round((onChain.c / totalBadges.c) * 100)
        : 0;
    expect(onChainRate).toBe(67);
  });

  it("should get top missions with completion counts", () => {
    const topMissions = db
      .prepare(
        `SELECT m.title, m.badge_name, m.category, COUNT(eb.id) as completions
         FROM missions m
         LEFT JOIN earned_badges eb ON eb.mission_id = m.id
         GROUP BY m.id
         ORDER BY completions DESC
         LIMIT 5`
      )
      .all() as {
      title: string;
      badge_name: string;
      completions: number;
    }[];

    expect(topMissions).toHaveLength(2);
    expect(topMissions[0].title).toBe("Reading");
    expect(topMissions[0].completions).toBe(2);
    expect(topMissions[1].title).toBe("Coding");
    expect(topMissions[1].completions).toBe(1);
  });
});

describe("API Logic - User Management", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = setupTestDb();
    const hash = bcrypt.hashSync("password123", 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u1", "Test User", "test@test.com", hash, "user");
  });

  it("should verify correct password with bcrypt", () => {
    const user = db
      .prepare("SELECT password FROM users WHERE id = ?")
      .get("u1") as { password: string };
    expect(bcrypt.compareSync("password123", user.password)).toBe(true);
    expect(bcrypt.compareSync("wrongpassword", user.password)).toBe(false);
  });

  it("should update user profile", () => {
    db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?").run(
      "Updated Name",
      "updated@test.com",
      "u1"
    );

    const user = db
      .prepare("SELECT name, email FROM users WHERE id = ?")
      .get("u1") as { name: string; email: string };
    expect(user.name).toBe("Updated Name");
    expect(user.email).toBe("updated@test.com");
  });

  it("should update password hash", () => {
    const newHash = bcrypt.hashSync("newpassword", 10);
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newHash, "u1");

    const user = db
      .prepare("SELECT password FROM users WHERE id = ?")
      .get("u1") as { password: string };
    expect(bcrypt.compareSync("newpassword", user.password)).toBe(true);
    expect(bcrypt.compareSync("password123", user.password)).toBe(false);
  });

  it("should detect duplicate emails", () => {
    const hash = bcrypt.hashSync("pass", 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u2", "Other User", "other@test.com", hash, "user");

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get("other@test.com", "u1");
    expect(existing).toBeDefined();

    const notExisting = db
      .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get("nonexistent@test.com", "u1");
    expect(notExisting).toBeUndefined();
  });
});

describe("API Logic - Badge Earning", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = setupTestDb();
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("m1", "Test", "Test mission", "star", "Star Badge", "#FFF", "star", "Test", "BF", "Do it", now);

    const hash = bcrypt.hashSync("pass", 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u1", "User", "user@test.com", hash, "user");
  });

  it("should prevent earning same mission twice by same user", () => {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb1", "m1", "u1", "Star Badge", "#FFF", "star", "Test", now);

    // Check if user already earned this badge
    const existing = db
      .prepare(
        "SELECT id FROM earned_badges WHERE mission_id = ? AND user_id = ?"
      )
      .get("m1", "u1");
    expect(existing).toBeDefined();

    // Different user should not have it
    const notExisting = db
      .prepare(
        "SELECT id FROM earned_badges WHERE mission_id = ? AND user_id = ?"
      )
      .get("m1", "u2");
    expect(notExisting).toBeUndefined();
  });

  it("should list badges for a specific user", () => {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("m2", "Test2", "Test mission 2", "code", "Code Badge", "#EEE", "code", "Dev", "BF", "Code it", now);

    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb2", "m2", "u1", "Code Badge", "#EEE", "code", "Dev", now);

    const badges = db
      .prepare(
        "SELECT * FROM earned_badges WHERE user_id = ? ORDER BY earned_at DESC"
      )
      .all("u1") as { id: string; badge_name: string }[];
    expect(badges).toHaveLength(2);
    expect(badges.map((b) => b.badge_name)).toContain("Star Badge");
    expect(badges.map((b) => b.badge_name)).toContain("Code Badge");
  });
});
