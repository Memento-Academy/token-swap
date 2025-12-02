"use client";

import { Loader2, ExternalLink, CheckCircle } from "lucide-react";

interface FaucetModalProps {
  isOpen: boolean;
  status: "loading" | "success" | "error";
  txHash?: string;
  onClose: () => void;
}

export function FaucetModal({
  isOpen,
  status,
  txHash,
  onClose,
}: FaucetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-3xl p-8 max-w-md w-full mx-4 border border-green-400/30 shadow-2xl backdrop-blur-xl">
        {status === "loading" && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="text-green-400 animate-spin" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Minting Tokens...
            </h3>
            <p className="text-gray-400 mb-4">
              Please wait while your test tokens are being minted.
            </p>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm underline"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-500/20 rounded-full p-4">
                <CheckCircle className="text-green-400" size={64} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Tokens Received!
            </h3>
            <p className="text-gray-400 mb-6">
              9,090,909 PEPE and 100 USDC have been successfully added to your account.
            </p>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm underline mb-6"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-red-500/20 rounded-full p-4">
                <svg
                  className="text-red-400"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Minting Failed</h3>
            <p className="text-gray-400 mb-6">
              There was an error minting your tokens. Please try again.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
