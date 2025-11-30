"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartAccount } from "@/context/SmartAccountContext";
import { formatUnits, createPublicClient, http, parseAbi, parseUnits, encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { Wallet, Coins, Copy, Check } from "lucide-react";
import { SuccessModal } from "./SuccessModal";

// Token addresses on Sepolia
const PEPE_ADDRESS = process.env.NEXT_PUBLIC_PEPE_ADDRESS || "0xab70891DBdE676FA2395DF540AB85eE1E44Ac1F1";
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "0xb93f0EC84BCAc58E07287fB38d5B87fedf26C3f4";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function faucet(uint256 amount) external",
]);

export function AccountInfo() {
  const { ready, authenticated, user } = usePrivy();
  const { smartAccountAddress, isLoading: isSmartAccountLoading, kernelClient, account } = useSmartAccount();

  const [pepeBalance, setPepeBalance] = useState<{
    value: bigint;
    decimals: number;
  } | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<{
    value: bigint;
    decimals: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const copyAddress = () => {
    if (smartAccountAddress) {
      navigator.clipboard.writeText(smartAccountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchBalances = async () => {
    if (!smartAccountAddress) return;

    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
      });

      // Fetch PEPE balance
      const pepeValue = await publicClient.readContract({
        address: PEPE_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [smartAccountAddress as `0x${string}`],
        authorizationList: undefined,
      });

      // Fetch USDC balance
      const usdcValue = await publicClient.readContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [smartAccountAddress as `0x${string}`],
        authorizationList: undefined,
      });

      setPepeBalance({ value: pepeValue, decimals: 18 });
      setUsdcBalance({ value: usdcValue, decimals: 6 }); // USDC has 6 decimals
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [smartAccountAddress]);

  const handleFaucet = async () => {
    if (!kernelClient || !smartAccountAddress || !account) return;
    
    setIsFaucetLoading(true);
    try {
      console.log("Claiming faucet...");
      
      // Amount to mint: 500 tokens (well within 1000 limit)
      const amountPEPE = parseUnits("500", 18);
      const amountUSDC = parseUnits("500", 6);

      console.log("Claiming PEPE...");
      const txHashPepe = await kernelClient.sendTransaction({
        to: PEPE_ADDRESS as `0x${string}`,
        value: 0n,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "faucet",
          args: [amountPEPE],
        }),
      });
      console.log("PEPE tx sent:", txHashPepe);

      console.log("Claiming USDC...");
      const txHashUsdc = await kernelClient.sendTransaction({
        to: USDC_ADDRESS as `0x${string}`,
        value: 0n,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "faucet",
          args: [amountUSDC],
        }),
      });
      console.log("USDC tx sent:", txHashUsdc);
      
      // Wait for transactions to be mined
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
      });
      
      console.log("Waiting for receipts...");
      await Promise.all([
        publicClient.waitForTransactionReceipt({ hash: txHashPepe }),
        publicClient.waitForTransactionReceipt({ hash: txHashUsdc })
      ]);
      
      // Refresh balances
      await fetchBalances();
      setLastTxHash(txHashPepe);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error("Faucet error full object:", error);
      console.error("Faucet error message:", error?.message);
      console.error("Faucet error cause:", error?.cause);
      alert(`Error claiming tokens: ${error?.message || "Unknown error"}`);
    } finally {
      setIsFaucetLoading(false);
    }
  };

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

  if (isSmartAccountLoading) {
    return (
      <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
           <h2 className="text-2xl font-bold text-white">Loading Smart Account...</h2>
        </div>
      </div>
    );
  }

  if (!smartAccountAddress) {
    return (
      <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Wallet className="text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Account Info</h2>
        </div>
        <p className="text-gray-400">
          Initializing Smart Account...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <Wallet className="text-blue-400" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Smart Account</h2>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2 font-medium">Address</p>
        <div className="relative group">
          <div className="w-full bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 break-all">
            {smartAccountAddress}
          </div>
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
            Kernel v3 (ZeroDev)
          </span>
        </p>
      </div>

      {/* Token Balances */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/20 rounded-lg">
              <Coins className="text-green-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Token Balances</h3>
          </div>
          
          <button 
            onClick={handleFaucet}
            disabled={isFaucetLoading}
            className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/30 flex items-center gap-2"
          >
            {isFaucetLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-300"></div>
                Minting...
              </>
            ) : (
              "Get Test Tokens"
            )}
          </button>
        </div>

        <div className="glass-effect rounded-xl p-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/icons/pepe-3d-icon.webp"
                alt="PEPE"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20"
              />
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
              <img
                src="/icons/usdc-3d-icon.webp"
                alt="USDC"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20"
              />
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

      <div className="mt-6">
        <div className="w-full bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center justify-center gap-2">
          <span className="text-green-400 text-xs font-bold uppercase tracking-wider">
            ⚡ Gasless Transactions Enabled
          </span>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Tokens Received!"
        message="500 PEPE and 500 USDC have been successfully added to your account."
        txHash={lastTxHash || undefined}
      />
    </div>
  );
}
