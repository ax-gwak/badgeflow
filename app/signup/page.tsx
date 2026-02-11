"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Sign up failed");
      setLoading(false);
      return;
    }

    // Auto sign in after signup
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign in failed. Please try logging in.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[var(--primary)] text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-white text-[24px]">hexagon</span>
          <span className="text-[18px] font-primary font-bold text-white">
            BADGEFLOW
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <div>
            <h1 className="text-[36px] font-primary font-bold leading-tight text-white">
              Start your badge journey today.
            </h1>
            <p className="text-[16px] text-white/80 font-secondary mt-4">
              Create your account and begin earning, issuing, and sharing
              verified digital badges.
            </p>
          </div>
        </div>

        <p className="text-[14px] text-white/60 font-secondary">
          Trusted by 500+ educational institutions
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-[var(--card)] flex items-center justify-center p-8 md:p-12 flex-1">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[400px] flex flex-col gap-5"
        >
          <h2 className="text-[28px] font-primary font-bold">
            Create an account
          </h2>
          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary -mt-3">
            Fill in the details below to get started
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3 text-[14px] text-red-700 font-secondary">
              {error}
            </div>
          )}

          <Input
            label="Name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            placeholder="At least 6 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="default"
            size="large"
            className="w-full mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-[14px] text-[var(--muted-foreground)] font-secondary text-center">
            Already have an account?{" "}
            <span
              className="text-[var(--primary)] font-medium cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
