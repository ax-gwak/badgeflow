import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyBadgeOnChain, getNetworkInfo } from "@/lib/blockchain";
import type { EarnedBadge, BlockchainVerification } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const badge = db
    .prepare("SELECT * FROM earned_badges WHERE id = ?")
    .get(id) as EarnedBadge | undefined;

  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  const result = await verifyBadgeOnChain({
    id: badge.id,
    mission_id: badge.mission_id,
    user_id: badge.user_id,
    badge_name: badge.badge_name,
    earned_at: badge.earned_at,
  });

  const verification: BlockchainVerification = {
    status: result.status,
    onChainHash: result.onChainHash,
    computedHash: result.computedHash,
    issuer: result.issuer,
    timestamp: result.timestamp,
    txHash: badge.tx_hash,
    blockNumber: badge.block_number,
    contractAddress: badge.contract_address,
    message: result.message,
  };

  const networkInfo = getNetworkInfo();

  return NextResponse.json({ ...verification, ...networkInfo });
}
