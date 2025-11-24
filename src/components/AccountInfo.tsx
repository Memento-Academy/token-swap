"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { formatUnits, createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";
import { Wallet, Coins, Copy, Check } from "lucide-react";

// Token addresses on Sepolia
const PEPE_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
]);

export function AccountInfo() {
  const { ready, authenticated, user } = usePrivy();
  const { client } = useSmartWallets();

  // Debug logs
  console.log("Privy ready:", ready);
  console.log("Privy authenticated:", authenticated);
  console.log("Privy user:", user);
  const [pepeBalance, setPepeBalance] = useState<{
    value: bigint;
    decimals: number;
  } | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<{
    value: bigint;
    decimals: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Log all linked accounts for debugging
  console.log("Linked accounts:", user?.linkedAccounts);
  // Get smart wallet address
  const smartWallet = user?.linkedAccounts?.find(
    (account) => account.type === "smart_wallet"
  );
  console.log("Smart wallet:", smartWallet);

  const smartWalletAddress = smartWallet?.address as `0x${string}` | undefined;
  console.log("Smart wallet address:", smartWalletAddress);

  const copyAddress = () => {
    if (smartWalletAddress) {
      navigator.clipboard.writeText(smartWalletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!smartWalletAddress) return;

    const fetchBalances = async () => {
      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(),
        });

        // Fetch PEPE balance
        // @ts-ignore - viem type issue with authorizationList
        const pepeValue = await publicClient.readContract({
          address: PEPE_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [smartWalletAddress],
        });

        // Fetch USDC balance
        // @ts-ignore - viem type issue with authorizationList
        const usdcValue = await publicClient.readContract({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [smartWalletAddress],
        });

        setPepeBalance({ value: pepeValue, decimals: 18 });
        setUsdcBalance({ value: usdcValue, decimals: 18 });
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, [smartWalletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Wallet className="text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Account Info</h2>
        </div>
        <p className="text-gray-400">
          Connect your wallet to view account details
        </p>
      </div>
    );
  }

  if (!smartWalletAddress) {
    return (
      <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Wallet className="text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Account Info</h2>
        </div>
        <p className="text-gray-400">
          No smart wallet found for this account.
          <br />
          Please create or link a smart wallet in Privy to view your account
          details.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
          <Wallet className="text-blue-400" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Smart Account</h2>
      </div>

      {/* Smart Wallet Address */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2 font-medium">Address</p>
        <div className="glass-effect rounded-xl p-4 group relative">
          <p className="font-mono text-sm text-gray-200 break-all pr-10">
            {smartWalletAddress}
          </p>
          <button
            onClick={copyAddress}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check className="text-green-400" size={18} />
            ) : (
              <Copy
                className="text-gray-400 group-hover:text-white"
                size={18}
              />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Type:{" "}
          <span className="text-purple-400 font-medium">
            {smartWallet?.smartWalletType || "kernel"}
          </span>
        </p>
      </div>

      {/* Token Balances */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-green-500/20 rounded-lg">
            <Coins className="text-green-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Token Balances</h3>
        </div>

        <div className="glass-effect rounded-xl p-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">🐸</span>
              </div>
              <span className="text-gray-300 font-medium">PEPE</span>
            </div>
            <span className="font-bold text-white text-lg">
              {pepeBalance
                ? `${parseFloat(
                    formatUnits(pepeBalance.value, pepeBalance.decimals)
                  ).toFixed(2)}`
                : "0.00"}
            </span>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">$</span>
              </div>
              <span className="text-gray-300 font-medium">USDC</span>
            </div>
            <span className="font-bold text-white text-lg">
              {usdcBalance
                ? `${parseFloat(
                    formatUnits(usdcBalance.value, usdcBalance.decimals)
                  ).toFixed(2)}`
                : "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Gasless Badge */}
      <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-3 text-center">
        <p className="text-green-400 text-sm font-semibold">
          ⚡ Gasless Transactions Enabled
        </p>
      </div>
    </div>
  );
}
