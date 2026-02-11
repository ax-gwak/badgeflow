"use client";

import { useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card } from "@/components/ui/Card";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  body?: string;
  response?: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/missions",
    description: "List all missions with completion status for the current user",
    auth: false,
    response: `[{ "id": "mission-1", "title": "책 10권 읽기", "badge_name": "Reading Master", "category": "책읽기 활동", "completed": 0 }]`,
  },
  {
    method: "POST",
    path: "/api/missions/{id}/complete",
    description: "Complete a mission and earn a badge. Optionally registers on blockchain.",
    auth: true,
    response: `{ "badge": { "id": "...", "badge_name": "Reading Master", "tx_hash": "0x...", "block_number": 42 } }`,
  },
  {
    method: "GET",
    path: "/api/earned-badges",
    description: "List earned badges for the current authenticated user",
    auth: true,
    response: `[{ "id": "...", "badge_name": "Reading Master", "category": "책읽기 활동", "tx_hash": "0x..." }]`,
  },
  {
    method: "GET",
    path: "/api/earned-badges/{id}",
    description: "Get a single earned badge by ID",
    auth: false,
    response: `{ "id": "...", "badge_name": "Reading Master", "badge_color": "#E8F5E9", "tx_hash": "0x..." }`,
  },
  {
    method: "DELETE",
    path: "/api/earned-badges/{id}",
    description: "Revoke an earned badge (admin only)",
    auth: true,
    response: `{ "success": true }`,
  },
  {
    method: "GET",
    path: "/api/badges",
    description: "List all badge templates (missions)",
    auth: false,
    response: `[{ "id": "badge-...", "badge_name": "...", "category": "...", "issuer": "BadgeFlow" }]`,
  },
  {
    method: "POST",
    path: "/api/badges",
    description: "Create a new badge template",
    auth: true,
    body: `{ "badge_name": "New Badge", "category": "학습 활동", "description": "...", "issuer": "BadgeFlow", "criteria": "..." }`,
    response: `{ "id": "badge-...", "badge_name": "New Badge", ... }`,
  },
  {
    method: "DELETE",
    path: "/api/badges/{id}",
    description: "Delete a badge template",
    auth: true,
    response: `{ "success": true }`,
  },
  {
    method: "GET",
    path: "/api/dashboard",
    description: "Get dashboard metrics and recent issuances",
    auth: false,
    response: `{ "metrics": [...], "recentIssuances": [...] }`,
  },
  {
    method: "GET",
    path: "/api/analytics",
    description: "Get platform analytics: categories, daily trends, top missions, summary",
    auth: false,
    response: `{ "byCategory": [...], "dailyIssuances": [...], "topMissions": [...], "summary": { "totalBadges": 10, "onChainRate": 67 } }`,
  },
  {
    method: "GET",
    path: "/api/verify/{id}",
    description: "Verify a badge on the blockchain. Returns verification status and on-chain data.",
    auth: false,
    response: `{ "status": "verified", "onChainHash": "0x...", "computedHash": "0x...", "issuer": "0x...", "message": "Badge data matches the on-chain record." }`,
  },
  {
    method: "POST",
    path: "/api/auth/signup",
    description: "Register a new user account",
    auth: false,
    body: `{ "name": "John Doe", "email": "john@example.com", "password": "pass1234" }`,
    response: `{ "id": "...", "name": "John Doe", "email": "john@example.com" }`,
  },
  {
    method: "GET",
    path: "/api/settings",
    description: "Get current user profile",
    auth: true,
    response: `{ "id": "...", "name": "Admin", "email": "admin@badgeflow.com", "role": "admin" }`,
  },
  {
    method: "PUT",
    path: "/api/settings",
    description: "Update profile or change password",
    auth: true,
    body: `{ "action": "profile", "name": "New Name", "email": "new@email.com" }\n// or\n{ "action": "password", "currentPassword": "...", "newPassword": "..." }`,
    response: `{ "success": true }`,
  },
  {
    method: "GET",
    path: "/api/admin/users",
    description: "List all users with badge counts (admin only)",
    auth: true,
    response: `[{ "id": "...", "name": "Admin", "role": "admin", "badgeCount": 5 }]`,
  },
  {
    method: "PUT",
    path: "/api/admin/users",
    description: "Change user role (admin only)",
    auth: true,
    body: `{ "userId": "...", "role": "admin" }`,
    response: `{ "success": true }`,
  },
  {
    method: "DELETE",
    path: "/api/admin/users",
    description: "Delete a user and their badges (admin only)",
    auth: true,
    body: `{ "userId": "..." }`,
    response: `{ "success": true }`,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
  POST: "bg-[var(--color-info)] text-[var(--color-info-foreground)]",
  PUT: "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]",
  DELETE: "bg-[var(--color-error)] text-[var(--color-error-foreground)]",
};

export default function ApiDocsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      <PublicHeader />
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-[28px] font-primary font-bold">API Documentation</h1>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary mt-1">
            BadgeFlow REST API reference. Base URL: <code className="bg-[var(--secondary)] px-1.5 py-0.5 rounded text-[13px]">http://localhost:3000</code>
          </p>

          <div className="flex flex-col gap-2 mt-6">
            {endpoints.map((ep, i) => (
              <Card key={i} className="!rounded-[12px]">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[11px] font-primary font-bold min-w-[60px] text-center ${methodColors[ep.method]}`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-[13px] font-primary text-[var(--foreground)] flex-1">
                    {ep.path}
                  </code>
                  {ep.auth && (
                    <span className="material-icons text-[14px] text-[var(--color-warning-foreground)]" title="Auth required">
                      lock
                    </span>
                  )}
                  <span className="material-icons text-[16px] text-[var(--muted-foreground)]">
                    {expanded === i ? "expand_less" : "expand_more"}
                  </span>
                </div>

                {expanded === i && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-[13px] font-secondary text-[var(--muted-foreground)]">
                      {ep.description}
                    </p>
                    {ep.body && (
                      <div className="mt-3">
                        <p className="text-[12px] font-primary font-bold text-[var(--foreground)] mb-1">
                          Request Body
                        </p>
                        <pre className="bg-[var(--secondary)] p-3 rounded-[8px] text-[12px] font-primary text-[var(--foreground)] overflow-x-auto whitespace-pre-wrap">
                          {ep.body}
                        </pre>
                      </div>
                    )}
                    {ep.response && (
                      <div className="mt-3">
                        <p className="text-[12px] font-primary font-bold text-[var(--foreground)] mb-1">
                          Response
                        </p>
                        <pre className="bg-[var(--secondary)] p-3 rounded-[8px] text-[12px] font-primary text-[var(--foreground)] overflow-x-auto whitespace-pre-wrap">
                          {ep.response}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
