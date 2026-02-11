import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import type { EarnedBadge } from "@/lib/types";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const badge = db
    .prepare("SELECT * FROM earned_badges WHERE id = ?")
    .get(id) as EarnedBadge | undefined;

  if (!badge) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#F2F3F0",
            color: "#111",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          Badge Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#F2F3F0",
          padding: 60,
        }}
      >
        {/* Left - Badge Visual */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            height: 280,
            borderRadius: 32,
            backgroundColor: badge.badge_color,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 120, opacity: 0.3 }}>
            ★
          </span>
        </div>

        {/* Right - Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 60,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#004D1A",
              fontSize: 20,
            }}
          >
            ✓ Verified Badge
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#111",
              marginTop: 16,
              lineHeight: 1.2,
            }}
          >
            {badge.badge_name}
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#666",
              marginTop: 12,
            }}
          >
            {badge.category}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 40,
              fontSize: 18,
              color: "#666",
            }}
          >
            <span
              style={{
                backgroundColor: "#FF8400",
                color: "#111",
                padding: "8px 20px",
                borderRadius: 999,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              BADGEFLOW
            </span>
            <span>
              Earned {new Date(badge.earned_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
