"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Props {
  badgeId: string;
}

export function ClaimActions({ badgeId }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mt-8">
      <Button
        variant="default"
        size="large"
        onClick={() => router.push(`/share/${badgeId}`)}
      >
        View Badge
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          navigator.clipboard.writeText(
            `${window.location.origin}/share/${badgeId}`
          );
        }}
      >
        Share
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push(`/share/${badgeId}`)}
      >
        Verify
      </Button>
    </div>
  );
}
