"use client";

import { useState, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { parseUnits, encodeFunctionData, parseAbi } from "viem";
import { ArrowDownUp, Loader2, ExternalLink, Info } from "lucide-react";

// Token addresses on Sepolia
const PEPE_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// ERC-20 ABI for approve and transfer
const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export function SwapCard() {
  const { authenticated } = usePrivy();
  // Cast to any to avoid "Type instantiation is excessively deep" error with viem types
  const { client } = useSmartWallets() as { client: any };

  const [fromToken, setFromToken] = useState<"PEPE" | "USDC">("PEPE");
  const [toToken, setToToken] = useState<"PEPE" | "USDC">("USDC");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSwap = async () => {
    console.log("Swap button clicked", {
      authenticated,
      client,
      amount,
      fromToken,
      toToken,
    });
    if (!authenticated) {
      alert("Debes conectar tu wallet para hacer swap.");
      return;
    }
    if (!client) {
      alert("No se encontró la smart wallet. Intenta reconectar.");
      return;
    }
    if (!amount) {
      alert("Introduce una cantidad válida.");
      return;
    }
    try {
      setIsSwapping(true);
      setTxHash(null);

      const fromAddress = fromToken === "PEPE" ? PEPE_ADDRESS : USDC_ADDRESS;
      const toAddress = toToken === "PEPE" ? PEPE_ADDRESS : USDC_ADDRESS;

      // Parse amount (assuming 18 decimals for both tokens)
      const amountWei = parseUnits(amount, 18);

      // For demo purposes, we'll just do a simple transfer
      // In a real app, you'd interact with a DEX contract
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [toAddress as `0x${string}`, amountWei],
      });

      // Send transaction using Privy smart wallet client
      const hash = await client.sendTransaction({
        to: fromAddress as `0x${string}`,
        data,
        value: 0n,
      });

      setTxHash(hash);
      setAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Check console for details.");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleFlipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Swap Tokens
      </h2>

      {/* From Token */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block font-medium">
          From
        </label>
        <div className="glass-effect rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3 relative" ref={fromRef}>
            <button
              type="button"
              className="flex items-center gap-2 bg-white/10 text-white rounded-xl px-2.5 py-2 border border-white/20 focus:outline-none focus:border-blue-400 transition-colors font-medium cursor-pointer hover:bg-white/15 min-w-[90px] w-[110px]"
              onClick={() => setFromOpen((open) => !open)}
              disabled={!authenticated}
              aria-label="From token"
            >
              <img
                src={
                  fromToken === "PEPE"
                    ? "/icons/pepe-3d-icon.webp"
                    : "/icons/usdc-3d-icon.webp"
                }
                alt={fromToken}
                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 mr-2"
              />
              <span>{fromToken}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {fromOpen && (
              <div className="absolute left-0 top-12 z-20 w-[110px] bg-gray-900 rounded-xl shadow-lg border border-white/10 animate-fade-in">
                {["PEPE", "USDC"].map((token) => (
                  <button
                    key={token}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-500/20 transition-colors ${
                      fromToken === token ? "bg-blue-500/10" : ""
                    }`}
                    onClick={() => {
                      setFromToken(token as "PEPE" | "USDC");
                      setFromOpen(false);
                    }}
                  >
                    <img
                      src={
                        token === "PEPE"
                          ? "/icons/pepe-3d-icon.webp"
                          : "/icons/usdc-3d-icon.webp"
                      }
                      alt={token}
                      className="w-6 h-6 rounded-full bg-white/10 border border-white/20 mr-2"
                    />
                    <span>{token}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex items-center group">
            <input
              type="number"
              value={amount}
              min="0"
              onChange={(e) => {
                // Only allow positive numbers and empty string, and prevent leading zeros (except for '0.' decimal)
                let val = e.target.value;
                if (val === "") {
                  setAmount("");
                  return;
                }
                // Remove leading zeros unless it's '0.'
                if (/^0\d+/.test(val)) {
                  val = val.replace(/^0+/, "");
                }
                // Allow '0.' for decimals
                if (val.startsWith("0") && val[1] === ".") {
                  // valid, do nothing
                } else if (val.startsWith("0") && val.length > 1) {
                  val = val.replace(/^0+/, "");
                }
                if (/^\d*\.?\d*$/.test(val) && Number(val) >= 0) {
                  setAmount(val);
                }
              }}
              placeholder="0.0"
              className="w-full bg-transparent text-white text-3xl font-bold focus:outline-none placeholder-gray-600"
              disabled={!authenticated}
            />
            <span className="ml-2 relative flex items-center">
              <Info className="text-blue-400 cursor-pointer" size={20} />
              <span className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-lg bg-gray-900 text-gray-200 text-xs px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 border border-white/10">
                Introduce la cantidad de cripto que quieres swapear.
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleFlipTokens}
          className="glass-effect-strong p-3 rounded-2xl border-4 border-gray-900/50 transition-all hover:scale-110 hover:rotate-180 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
          disabled={!authenticated}
          title="Swap direction"
          aria-label="Swap direction"
        >
          <ArrowDownUp
            className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            size={24}
          />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block font-medium">
          To
        </label>
        <div className="glass-effect rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3 relative" ref={toRef}>
            <button
              type="button"
              className="flex items-center gap-2 bg-white/10 text-white rounded-xl px-2.5 py-2 border border-white/20 focus:outline-none focus:border-purple-400 transition-colors font-medium cursor-pointer hover:bg-white/15 min-w-[90px] w-[110px]"
              onClick={() => setToOpen((open) => !open)}
              disabled={!authenticated}
              aria-label="To token"
            >
              <img
                src={
                  toToken === "PEPE"
                    ? "/icons/pepe-3d-icon.webp"
                    : "/icons/usdc-3d-icon.webp"
                }
                alt={toToken}
                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 mr-2"
              />
              <span>{toToken}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {toOpen && (
              <div className="absolute left-0 top-12 z-20 w-[110px] bg-gray-900 rounded-xl shadow-lg border border-white/10 animate-fade-in">
                {["PEPE", "USDC"].map((token) => (
                  <button
                    key={token}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-purple-500/20 transition-colors ${
                      toToken === token ? "bg-purple-500/10" : ""
                    }`}
                    onClick={() => {
                      setToToken(token as "PEPE" | "USDC");
                      setToOpen(false);
                    }}
                  >
                    <img
                      src={
                        token === "PEPE"
                          ? "/icons/pepe-3d-icon.webp"
                          : "/icons/usdc-3d-icon.webp"
                      }
                      alt={token}
                      className="w-6 h-6 rounded-full bg-white/10 border border-white/20 mr-2"
                    />
                    <span>{token}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-gray-400">
            {amount || "0.0"}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={
          !authenticated || !amount || isSwapping || fromToken === toToken
        }
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
      >
        {isSwapping ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Swapping...
          </>
        ) : (
          "Swap"
        )}
      </button>

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4">
          <p className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
            <span className="text-lg">✓</span> Swap Successful!
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs break-all underline flex items-center gap-1 hover:gap-2 transition-all"
          >
            View on Explorer <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Gasless Info */}
      {authenticated && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ⚡ This transaction is{" "}
            <span className="text-green-400 font-semibold">gasless</span> - no
            ETH required!
          </p>
        </div>
      )}
    </div>
  );
}
