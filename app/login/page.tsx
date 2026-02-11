"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[400px] flex flex-col gap-6"
        >
          <h2 className="text-[28px] font-primary font-bold">Welcome back</h2>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary -mt-4">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3 text-[14px] text-red-700 font-secondary">
              {error}
            </div>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="bg-[var(--muted)] rounded-[8px] px-4 py-3 text-[13px] text-[var(--muted-foreground)] font-secondary">
            <strong>Demo Account:</strong> admin@badgeflow.com / admin1234
          </div>

          <Button
            variant="default"
            size="large"
            className="w-full mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
