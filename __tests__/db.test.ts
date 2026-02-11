import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const TEST_DB_PATH = path.join(process.cwd(), "data", "test-badgeflow.db");

function createTestDb(): Database.Database {
  // Clean up previous test DB
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
      user_id TEXT NOT NULL DEFAULT 'test-user',
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

describe("Database Schema", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = createTestDb();
  });

  it("should create users table with correct columns", () => {
    const columns = db.prepare("PRAGMA table_info(users)").all() as {
      name: string;
      type: string;
    }[];
    const names = columns.map((c) => c.name);
    expect(names).toContain("id");
    expect(names).toContain("name");
    expect(names).toContain("email");
    expect(names).toContain("password");
    expect(names).toContain("role");
    expect(names).toContain("created_at");
  });

  it("should create missions table with correct columns", () => {
    const columns = db.prepare("PRAGMA table_info(missions)").all() as {
      name: string;
    }[];
    const names = columns.map((c) => c.name);
    expect(names).toContain("id");
    expect(names).toContain("title");
    expect(names).toContain("badge_name");
    expect(names).toContain("badge_color");
    expect(names).toContain("category");
    expect(names).toContain("issuer");
    expect(names).toContain("criteria");
  });

  it("should create earned_badges table with blockchain columns", () => {
    const columns = db.prepare("PRAGMA table_info(earned_badges)").all() as {
      name: string;
    }[];
    const names = columns.map((c) => c.name);
    expect(names).toContain("tx_hash");
    expect(names).toContain("contract_address");
    expect(names).toContain("block_number");
  });

  it("should enforce unique email constraint on users", () => {
    const hash = bcrypt.hashSync("pass", 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u1", "User One", "test@example.com", hash, "user");

    expect(() => {
      db.prepare(
        "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
      ).run("u2", "User Two", "test@example.com", hash, "user");
    }).toThrow();
  });

  it("should INSERT OR IGNORE duplicate user ids", () => {
    const hash = bcrypt.hashSync("pass", 10);
    db.prepare(
      "INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run("u1", "Different Name", "other@example.com", hash, "user");

    const user = db.prepare("SELECT name FROM users WHERE id = ?").get("u1") as {
      name: string;
    };
    expect(user.name).toBe("User One"); // Original not overwritten
  });

  it("should insert and query missions", () => {
    db.prepare(
      "INSERT INTO missions (id, title, description, icon, badge_name, badge_color, badge_icon, category, issuer, criteria, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      "m1",
      "Test Mission",
      "A test mission",
      "star",
      "Test Badge",
      "#E8F5E9",
      "star",
      "Testing",
      "TestIssuer",
      "Do the test",
      new Date().toISOString()
    );

    const mission = db
      .prepare("SELECT * FROM missions WHERE id = ?")
      .get("m1") as { title: string; category: string };
    expect(mission.title).toBe("Test Mission");
    expect(mission.category).toBe("Testing");
  });

  it("should insert and query earned_badges with blockchain fields", () => {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at, tx_hash, contract_address, block_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      "eb1",
      "m1",
      "u1",
      "Test Badge",
      "#E8F5E9",
      "star",
      "Testing",
      now,
      "0xabc123",
      "0xContractAddr",
      42
    );

    const badge = db
      .prepare("SELECT * FROM earned_badges WHERE id = ?")
      .get("eb1") as {
      tx_hash: string;
      contract_address: string;
      block_number: number;
    };
    expect(badge.tx_hash).toBe("0xabc123");
    expect(badge.contract_address).toBe("0xContractAddr");
    expect(badge.block_number).toBe(42);
  });

  it("should handle null blockchain fields gracefully", () => {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO earned_badges (id, mission_id, user_id, badge_name, badge_color, badge_icon, category, earned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run("eb2", "m1", "u1", "No Chain Badge", "#FFF", "star", "Testing", now);

    const badge = db
      .prepare("SELECT * FROM earned_badges WHERE id = ?")
      .get("eb2") as {
      tx_hash: string | null;
      block_number: number | null;
    };
    expect(badge.tx_hash).toBeNull();
    expect(badge.block_number).toBeNull();
  });
});
