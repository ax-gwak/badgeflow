"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  badgeCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) await fetchUsers();
      else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch {}
    setActionId(null);
  };

  const deleteUser = async (userId: string, name: string) => {
    if (!confirm(`정말 "${name}" 유저를 삭제하시겠습니까? 모든 뱃지도 함께 삭제됩니다.`)) return;
    setActionId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) await fetchUsers();
      else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch {}
    setActionId(null);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout activeItem="users">
      <div className="p-4 md:p-8">
        <div>
          <h1 className="text-[24px] font-primary font-bold">User Management</h1>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
            Manage platform users and their roles
          </p>
        </div>

        <div className="mt-6">
          <Card>
            {loading ? (
              <div className="flex items-center justify-center h-[120px] text-[var(--muted-foreground)] font-secondary text-[14px]">
                Loading...
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center h-[120px] text-[var(--muted-foreground)] font-secondary text-[14px]">
                No users found.
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="hidden md:flex items-center bg-[var(--muted)] h-[44px] border-b border-[var(--border)]">
                  <span className="flex-[2] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                    User
                  </span>
                  <span className="flex-1 px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                    Role
                  </span>
                  <span className="w-[80px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)] text-center">
                    Badges
                  </span>
                  <span className="w-[120px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                    Joined
                  </span>
                  <span className="w-[120px] px-3 text-[13px] font-primary font-medium text-[var(--muted-foreground)]">
                    Actions
                  </span>
                </div>

                {/* Rows */}
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row md:items-center py-3 md:py-0 md:h-[56px] border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors gap-2 md:gap-0 px-3 md:px-0"
                  >
                    <div className="flex-[2] md:px-3">
                      <p className="text-[14px] font-secondary font-medium text-[var(--foreground)]">
                        {user.name}
                      </p>
                      <p className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex-1 md:px-3">
                      <Label variant={user.role === "admin" ? "violet" : "secondary"}>
                        {user.role}
                      </Label>
                    </div>
                    <div className="w-[80px] md:px-3 text-[14px] font-primary font-bold md:text-center">
                      {user.badgeCount}
                    </div>
                    <div className="w-[120px] md:px-3 text-[12px] font-secondary text-[var(--muted-foreground)]">
                      {formatDate(user.created_at)}
                    </div>
                    <div className="w-[120px] md:px-3 flex gap-1">
                      <Button
                        variant="outline"
                        size="default"
                        className="!h-[30px] !px-2 !text-[12px]"
                        onClick={() => toggleRole(user.id, user.role)}
                        disabled={actionId === user.id}
                      >
                        {user.role === "admin" ? "Demote" : "Promote"}
                      </Button>
                      <button
                        className="material-icons text-[18px] text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors disabled:opacity-30"
                        onClick={() => deleteUser(user.id, user.name)}
                        disabled={actionId === user.id}
                        title="Delete user"
                      >
                        delete_outline
                      </button>
                    </div>
                  </div>
                ))}

                <div className="px-3 py-2">
                  <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                    Total {users.length} users
                  </span>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
