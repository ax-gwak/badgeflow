"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";

const categories = [
  "시험 인증",
  "책읽기 활동",
  "학습 활동",
  "STEM",
  "창작 활동",
  "체육 활동",
];

const categoryPreview: Record<string, { icon: string; color: string }> = {
  "시험 인증": { icon: "quiz", color: "#FFF3E0" },
  "책읽기 활동": { icon: "menu_book", color: "#E8F5E9" },
  "학습 활동": { icon: "school", color: "#E3F2FD" },
  "STEM": { icon: "science", color: "#E0F2F1" },
  "창작 활동": { icon: "brush", color: "#F3E5F5" },
  "체육 활동": { icon: "fitness_center", color: "#FCE4EC" },
};

export default function BadgeCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [issuer, setIssuer] = useState("");
  const [criteria, setCriteria] = useState("");

  const preview = categoryPreview[category] || {
    icon: "workspace_premium",
    color: "#E7E8E5",
  };

  const canSave = badgeName.trim() && category && description.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const res = await fetch("/api/badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        badge_name: badgeName,
        category,
        description,
        issuer,
        criteria,
      }),
    });
    if (res.ok) {
      router.push("/badges");
    }
    setSaving(false);
  };

  return (
    <AdminLayout activeItem="badges">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[24px] font-primary font-bold">
              Create New Badge
            </h1>
            <p className="text-[14px] text-[var(--muted-foreground)]">
              뱃지 정보를 입력하고 등록하세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/badges")}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!canSave || saving}
            >
              {saving ? "저장 중..." : "Save Badge"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8 mt-6">
          {/* Left Column - Form Fields */}
          <div className="flex-1 flex flex-col gap-5">
            <Input
              label="뱃지 이름"
              placeholder="예: 독서왕 마스터"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[14px] font-medium font-secondary text-[var(--foreground)]">
                분류
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-[999px] text-[14px] font-secondary cursor-pointer transition-all border ${
                      category === cat
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              label="설명"
              placeholder="이 뱃지가 어떤 성취를 나타내는지 설명해주세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="인증처"
              placeholder="예: BadgeFlow Education, 한자검정시험위원회"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
            />
            <Textarea
              label="인증 조건"
              placeholder="뱃지를 획득하기 위해 충족해야 할 조건을 설명해주세요..."
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </div>

          {/* Right Column - Badge Preview */}
          <div className="w-[320px] shrink-0">
            <Card header="Badge Preview">
              {/* Badge Image Area */}
              <div
                className="w-full aspect-square rounded-[16px] flex items-center justify-center transition-colors"
                style={{ backgroundColor: preview.color }}
              >
                <span className="material-icons text-[80px] text-black/20">
                  {preview.icon}
                </span>
              </div>

              {/* Badge Info */}
              <div className="text-center mt-4">
                <p className="text-[18px] font-primary font-bold">
                  {badgeName || "뱃지 이름"}
                </p>
                <p className="text-[14px] text-[var(--muted-foreground)] font-secondary">
                  {category || "분류를 선택하세요"}
                </p>
                <p className="text-[13px] text-[var(--muted-foreground)] font-secondary mt-2">
                  {description || "설명을 입력하면 여기에 표시됩니다."}
                </p>

                {/* Issuer & Criteria */}
                {(issuer || criteria) && (
                  <div className="flex flex-col gap-1 mt-3">
                    {issuer && (
                      <div className="flex items-center justify-center gap-1">
                        <span className="material-icons text-[14px] text-[var(--color-success-foreground)]">
                          verified
                        </span>
                        <span className="text-[12px] text-[var(--color-success-foreground)] font-secondary">
                          {issuer}
                        </span>
                      </div>
                    )}
                    {criteria && (
                      <Label variant="secondary" className="text-[11px]">
                        {criteria.length > 30
                          ? criteria.slice(0, 30) + "..."
                          : criteria}
                      </Label>
                    )}
                  </div>
                )}

                <p className="text-[12px] text-[var(--muted-foreground)] mt-3">
                  Made by BadgeFlow
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
