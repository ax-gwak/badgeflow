"use client";

import React, { useEffect, useState } from "react";
import type { BlockchainVerification } from "@/lib/types";

interface VerificationResponse extends BlockchainVerification {
  network?: string;
  explorerUrl?: string | null;
}

interface Props {
  badgeId: string;
  txHash: string | null;
  contractAddress: string | null;
  blockNumber: number | null;
}

export function BlockchainBadge({
  badgeId,
  txHash,
  contractAddress,
  blockNumber,
}: Props) {
  const [verification, setVerification] =
    useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${badgeId}`)
      .then((res) => res.json())
      .then((data) => setVerification(data))
      .catch(() =>
        setVerification({
          status: "unavailable",
          onChainHash: null,
          computedHash: null,
          issuer: null,
          timestamp: null,
          txHash: null,
          blockNumber: null,
          contractAddress: null,
          message: "Failed to check blockchain verification.",
        })
      )
      .finally(() => setLoading(false));
  }, [badgeId]);

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-[var(--muted)] rounded-[16px] flex items-center gap-3 animate-pulse">
        <span className="material-icons text-[var(--muted-foreground)] text-[24px]">
          hourglass_empty
        </span>
        <div>
          <p className="text-[14px] font-primary font-bold text-[var(--muted-foreground)]">
            Checking Blockchain...
          </p>
          <p className="text-[13px] font-secondary text-[var(--muted-foreground)]">
            Verifying badge against on-chain records
          </p>
        </div>
      </div>
    );
  }

  if (!verification || verification.status === "unavailable") {
    return (
      <div className="mt-8 p-4 bg-[var(--muted)] rounded-[16px] flex items-center gap-3">
        <span className="material-icons text-[var(--muted-foreground)] text-[24px]">
          cloud_off
        </span>
        <div>
          <p className="text-[14px] font-primary font-bold text-[var(--muted-foreground)]">
            Blockchain Verification Unavailable
          </p>
          <p className="text-[13px] font-secondary text-[var(--muted-foreground)]">
            {verification?.message ||
              "The blockchain node is not currently running."}
          </p>
        </div>
      </div>
    );
  }

  if (verification.status === "not_registered") {
    return (
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-[16px] flex items-center gap-3">
        <span className="material-icons text-amber-600 text-[24px]">
          pending
        </span>
        <div>
          <p className="text-[14px] font-primary font-bold text-amber-700">
            Not Registered On-Chain
          </p>
          <p className="text-[13px] font-secondary text-amber-600">
            This badge was issued before blockchain integration was enabled.
          </p>
        </div>
      </div>
    );
  }

  if (verification.status === "mismatch") {
    return (
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-[16px] flex items-center gap-3">
        <span className="material-icons text-red-600 text-[24px]">error</span>
        <div>
          <p className="text-[14px] font-primary font-bold text-red-700">
            Verification Failed
          </p>
          <p className="text-[13px] font-secondary text-red-600">
            WARNING: Badge data does not match the on-chain record.
          </p>
        </div>
      </div>
    );
  }

  // status === "verified"
  const displayTxHash = txHash || verification.txHash;
  const displayBlock = blockNumber || verification.blockNumber;
  const displayContract = contractAddress || verification.contractAddress;
  const explorerUrl = verification.explorerUrl;
  const networkLabel = verification.network === "sepolia" ? "Sepolia Testnet" : "Localhost";

  return (
    <div className="mt-8 space-y-3">
      <div className="p-4 bg-[var(--color-success)] rounded-[16px] flex items-center gap-3">
        <span className="material-icons text-[var(--color-success-foreground)] text-[24px]">
          verified
        </span>
        <div>
          <p className="text-[14px] font-primary font-bold text-[var(--color-success-foreground)]">
            Blockchain Verified
          </p>
          <p className="text-[13px] font-secondary text-[var(--color-success-foreground)]">
            Badge data matches the on-chain record. Integrity confirmed. ({networkLabel})
          </p>
        </div>
      </div>

      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-[16px]">
        <h4 className="text-[13px] font-primary font-bold text-[var(--muted-foreground)] mb-3">
          ON-CHAIN RECORD
        </h4>
        <div className="space-y-2">
          {displayTxHash && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                Tx Hash
              </span>
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/tx/${displayTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-primary text-[var(--primary)] hover:underline"
                >
                  {displayTxHash.slice(0, 10)}...{displayTxHash.slice(-8)}
                </a>
              ) : (
                <code className="text-[12px] font-primary text-[var(--foreground)]">
                  {displayTxHash.slice(0, 10)}...{displayTxHash.slice(-8)}
                </code>
              )}
            </div>
          )}
          {displayBlock && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                Block
              </span>
              <code className="text-[12px] font-primary text-[var(--foreground)]">
                #{displayBlock}
              </code>
            </div>
          )}
          {displayContract && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                Contract
              </span>
              <code className="text-[12px] font-primary text-[var(--foreground)]">
                {displayContract.slice(0, 10)}...{displayContract.slice(-6)}
              </code>
            </div>
          )}
          {verification.issuer && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                Issuer
              </span>
              <code className="text-[12px] font-primary text-[var(--foreground)]">
                {verification.issuer.slice(0, 10)}...
                {verification.issuer.slice(-6)}
              </code>
            </div>
          )}
          {verification.computedHash && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-secondary text-[var(--muted-foreground)]">
                Data Hash
              </span>
              <code className="text-[12px] font-primary text-[var(--foreground)]">
                {verification.computedHash.slice(0, 10)}...
                {verification.computedHash.slice(-8)}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
