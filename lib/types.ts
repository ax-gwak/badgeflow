export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge_name: string;
  badge_color: string;
  badge_icon: string;
  category: string;
  issuer: string;
  criteria: string;
  created_at: string;
  completed: number; // 0 or 1 from SQLite JOIN
}

export interface EarnedBadge {
  id: string;
  mission_id: string;
  user_id: string;
  badge_name: string;
  badge_color: string;
  badge_icon: string;
  category: string;
  earned_at: string;
  tx_hash: string | null;
  contract_address: string | null;
  block_number: number | null;
}

export interface BlockchainVerification {
  status: "verified" | "mismatch" | "not_registered" | "unavailable";
  onChainHash: string | null;
  computedHash: string | null;
  issuer: string | null;
  timestamp: number | null;
  txHash: string | null;
  blockNumber: number | null;
  contractAddress: string | null;
  message: string;
}
