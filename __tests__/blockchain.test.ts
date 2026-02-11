import { describe, it, expect } from "vitest";
import { computeBadgeHash } from "@/lib/blockchain";

describe("computeBadgeHash", () => {
  const sampleBadge = {
    id: "badge-001",
    mission_id: "mission-1",
    user_id: "user-1",
    badge_name: "Reading Master",
    earned_at: "2025-01-15T10:00:00.000Z",
  };

  it("should return a valid keccak256 hash (66 char hex string)", () => {
    const hash = computeBadgeHash(sampleBadge);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("should return the same hash for the same input", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash(sampleBadge);
    expect(hash1).toBe(hash2);
  });

  it("should return a different hash for different badge ids", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash({ ...sampleBadge, id: "badge-002" });
    expect(hash1).not.toBe(hash2);
  });

  it("should return a different hash for different user ids", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash({ ...sampleBadge, user_id: "user-2" });
    expect(hash1).not.toBe(hash2);
  });

  it("should return a different hash for different mission ids", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash({ ...sampleBadge, mission_id: "mission-2" });
    expect(hash1).not.toBe(hash2);
  });

  it("should return a different hash for different badge names", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash({
      ...sampleBadge,
      badge_name: "Different Badge",
    });
    expect(hash1).not.toBe(hash2);
  });

  it("should return a different hash for different timestamps", () => {
    const hash1 = computeBadgeHash(sampleBadge);
    const hash2 = computeBadgeHash({
      ...sampleBadge,
      earned_at: "2025-02-01T00:00:00.000Z",
    });
    expect(hash1).not.toBe(hash2);
  });
});
