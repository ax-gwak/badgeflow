"use client";

import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export default function BadgeClaimPage() {
  return (
    <div className="flex flex-col h-full">
      <PublicHeader />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex gap-12 max-w-[900px] w-full">
          {/* Left Column - Badge Image */}
          <div className="w-[280px] shrink-0 flex flex-col items-center">
            <div className="w-[240px] h-[240px] bg-gradient-to-br from-[#FFC107] to-[#FF8400] rounded-[24px] flex items-center justify-center">
              <span className="material-icons text-[80px] text-white/80">
                menu_book
              </span>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[14px] font-primary font-bold text-[var(--foreground)] tracking-wider">
                LEVEL 3
              </p>
              <p className="text-[13px] text-[var(--muted-foreground)] font-secondary mt-1">
                Issued by BadgeFlow Education
              </p>
            </div>
          </div>

          {/* Right Column - Badge Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-icons text-[var(--color-success-foreground)] text-[18px]">
                verified
              </span>
              <span className="text-[13px] font-secondary text-[var(--color-success-foreground)]">
                Verified Issuer
              </span>
            </div>

            <h1 className="text-[28px] font-primary font-bold mt-2">
              Reading Level 3 Complete
            </h1>

            <p className="text-[14px] text-[var(--muted-foreground)] font-secondary leading-relaxed mt-3">
              This badge confirms that the recipient has successfully completed
              Reading Level 3, demonstrating strong comprehension and analytical
              reading skills across 30+ books.
            </p>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="text-[14px] font-primary font-bold">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Label variant="secondary">Reading</Label>
                <Label variant="secondary">Comprehension</Label>
                <Label variant="secondary">Critical Thinking</Label>
                <Label variant="secondary">Literature</Label>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Issue Date
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  Feb 6, 2026
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Expiry
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  Feb 6, 2027
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[var(--muted-foreground)] font-secondary">
                  Credential ID
                </p>
                <p className="text-[14px] font-primary font-medium mt-1">
                  BF-2026-0347
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-8">
              <Button variant="default" size="large">
                Claim This Badge
              </Button>
              <Button variant="outline">Share</Button>
              <Button variant="outline">Verify</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
