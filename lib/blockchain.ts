import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const BADGE_REGISTRY_ABI = [
  "function registerBadge(string calldata badgeId, bytes32 dataHash) external",
  "function getBadge(string calldata badgeId) external view returns (bytes32 dataHash, address issuer, uint256 timestamp, bool exists)",
  "function verifyBadge(string calldata badgeId, bytes32 expectedHash) external view returns (bool)",
  "function totalBadges() external view returns (uint256)",
];

// Hardhat Account #0 — well-known deterministic test key, NOT secret
const HARDHAT_ACCOUNT_0_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const RPC_URL = "http://127.0.0.1:8545";

interface DeploymentInfo {
  address: string;
  network: string;
  deployedAt: string;
}

function getDeploymentInfo(): DeploymentInfo | null {
  try {
    const filePath = path.join(process.cwd(), "data", "contract-deployment.json");
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

function getSigner(): ethers.Wallet {
  return new ethers.Wallet(HARDHAT_ACCOUNT_0_KEY, getProvider());
}

function getContract(
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract | null {
  const deployment = getDeploymentInfo();
  if (!deployment) return null;
  return new ethers.Contract(
    deployment.address,
    BADGE_REGISTRY_ABI,
    signerOrProvider || getProvider()
  );
}

export function computeBadgeHash(badge: {
  id: string;
  mission_id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}): string {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string", "string", "string", "string"],
      [badge.id, badge.mission_id, badge.user_id, badge.badge_name, badge.earned_at]
    )
  );
}

export async function isBlockchainAvailable(): Promise<boolean> {
  try {
    const provider = getProvider();
    await provider.getBlockNumber();
    return getDeploymentInfo() !== null;
  } catch {
    return false;
  }
}

export async function registerBadgeOnChain(badge: {
  id: string;
  mission_id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}): Promise<{
  txHash: string;
  blockNumber: number;
  contractAddress: string;
} | null> {
  try {
    const available = await isBlockchainAvailable();
    if (!available) return null;

    const signer = getSigner();
    const contract = getContract(signer);
    if (!contract) return null;

    const dataHash = computeBadgeHash(badge);
    const tx = await contract.registerBadge(badge.id, dataHash);
    const receipt = await tx.wait();

    const deployment = getDeploymentInfo()!;
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      contractAddress: deployment.address,
    };
  } catch (error) {
    console.error("Blockchain registration failed:", error);
    return null;
  }
}

export async function verifyBadgeOnChain(badge: {
  id: string;
  mission_id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}): Promise<{
  status: "verified" | "mismatch" | "not_registered" | "unavailable";
  onChainHash: string | null;
  computedHash: string;
  issuer: string | null;
  timestamp: number | null;
  message: string;
}> {
  const computedHash = computeBadgeHash(badge);

  try {
    const available = await isBlockchainAvailable();
    if (!available) {
      return {
        status: "unavailable",
        onChainHash: null,
        computedHash,
        issuer: null,
        timestamp: null,
        message: "Blockchain node is not running.",
      };
    }

    const contract = getContract();
    if (!contract) {
      return {
        status: "unavailable",
        onChainHash: null,
        computedHash,
        issuer: null,
        timestamp: null,
        message: "Smart contract not deployed. Run: npm run deploy",
      };
    }

    const [dataHash, issuer, timestamp, exists] = await contract.getBadge(badge.id);

    if (!exists) {
      return {
        status: "not_registered",
        onChainHash: null,
        computedHash,
        issuer: null,
        timestamp: null,
        message: "Badge not found on blockchain.",
      };
    }

    const onChainHashStr = dataHash as string;
    if (onChainHashStr === computedHash) {
      return {
        status: "verified",
        onChainHash: onChainHashStr,
        computedHash,
        issuer: issuer as string,
        timestamp: Number(timestamp),
        message: "Badge data matches the on-chain record. Verified.",
      };
    } else {
      return {
        status: "mismatch",
        onChainHash: onChainHashStr,
        computedHash,
        issuer: issuer as string,
        timestamp: Number(timestamp),
        message: "WARNING: Badge data does not match the on-chain record!",
      };
    }
  } catch (error) {
    console.error("Blockchain verification error:", error);
    return {
      status: "unavailable",
      onChainHash: null,
      computedHash,
      issuer: null,
      timestamp: null,
      message: "Failed to connect to blockchain node.",
    };
  }
}
