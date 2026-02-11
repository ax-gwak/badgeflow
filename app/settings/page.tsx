"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((d) => {
        setName(d.name ?? "");
        setEmail(d.email ?? "");
        setRole(d.role ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "profile", name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error });
      } else {
        setProfileMsg({ type: "success", text: "Profile updated successfully." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 4) {
      setPwMsg({
        type: "error",
        text: "Password must be at least 4 characters.",
      });
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "password", currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ type: "error", text: data.error });
      } else {
        setPwMsg({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwMsg({ type: "error", text: "Failed to change password." });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <AdminLayout activeItem="settings">
      <div className="p-4 md:p-8 max-w-[700px]">
        {/* Header */}
        <div>
          <h1 className="text-[24px] font-primary font-bold">Settings</h1>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
            Manage your account and preferences
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[200px] text-[var(--muted-foreground)] font-secondary text-[14px]">
            Loading...
          </div>
        ) : (
          <>
            {/* Profile Section */}
            <div className="mt-6">
              <Card
                header={
                  <span className="text-[16px] font-primary font-bold">
                    Profile
                  </span>
                }
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--background)] text-[14px] font-secondary outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--background)] text-[14px] font-secondary outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--secondary)] text-[14px] font-secondary text-[var(--muted-foreground)] cursor-not-allowed"
                    />
                  </div>

                  {profileMsg && (
                    <p
                      className={`text-[13px] font-secondary ${
                        profileMsg.type === "success"
                          ? "text-[var(--color-success-foreground)]"
                          : "text-[var(--destructive)]"
                      }`}
                    >
                      {profileMsg.text}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Password Section */}
            <div className="mt-6">
              <Card
                header={
                  <span className="text-[16px] font-primary font-bold">
                    Change Password
                  </span>
                }
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--background)] text-[14px] font-secondary outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--background)] text-[14px] font-secondary outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-secondary text-[var(--muted-foreground)] block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[40px] px-3 border border-[var(--border)] rounded-[8px] bg-[var(--background)] text-[14px] font-secondary outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>

                  {pwMsg && (
                    <p
                      className={`text-[13px] font-secondary ${
                        pwMsg.type === "success"
                          ? "text-[var(--color-success-foreground)]"
                          : "text-[var(--destructive)]"
                      }`}
                    >
                      {pwMsg.text}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handlePasswordChange}
                      disabled={pwSaving}
                    >
                      {pwSaving ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
