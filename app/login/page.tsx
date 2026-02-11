"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="w-1/2 bg-[var(--primary)] text-white p-12 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-white text-[24px]">hexagon</span>
          <span className="text-[18px] font-primary font-bold text-white">
            BADGEFLOW
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <div>
            <h1 className="text-[36px] font-primary font-bold leading-tight text-white">
              Every achievement deserves recognition.
            </h1>
            <p className="text-[16px] text-white/80 font-secondary mt-4">
              Create, issue, and verify digital badges for your learning
              community.
            </p>
          </div>
        </div>

        <p className="text-[14px] text-white/60 font-secondary">
          Trusted by 500+ educational institutions
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-[var(--card)] flex items-center justify-center p-12">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <h2 className="text-[28px] font-primary font-bold">Welcome back</h2>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary -mt-4">
            Sign in to your account to continue
          </p>

          <Input label="Email" placeholder="you@example.com" type="email" />

          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <a
              href="#"
              className="text-[13px] text-[var(--primary)] font-secondary text-right mt-1 block"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="default" size="large" className="w-full mt-2">
            Sign In
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-[var(--border)]" />
            <span className="text-[13px] text-[var(--muted-foreground)]">
              or
            </span>
            <hr className="flex-1 border-[var(--border)]" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Google
            </Button>
            <Button variant="outline" className="flex-1">
              GitHub
            </Button>
          </div>

          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary text-center">
            Don&apos;t have an account?{" "}
            <span className="text-[var(--primary)] font-medium cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
