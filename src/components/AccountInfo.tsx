'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { formatUnits, createPublicClient, http, parseAbi } from 'viem'
import { sepolia } from 'viem/chains'
import { Wallet, Coins } from 'lucide-react'

// Token addresses on Sepolia
const PEPE_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // Example PEPE on Sepolia
const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // Example USDC on Sepolia

const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
])

export function AccountInfo() {
  const { ready, authenticated, user } = usePrivy()
  const { client } = useSmartWallets()
  const [pepeBalance, setPepeBalance] = useState<{ value: bigint, decimals: number } | null>(null)
  const [usdcBalance, setUsdcBalance] = useState<{ value: bigint, decimals: number } | null>(null)

  // Get smart wallet address
  const smartWallet = user?.linkedAccounts?.find(
    (account) => account.type === 'smart_wallet'
  )

  const smartWalletAddress = smartWallet?.address as `0x${string}` | undefined

  useEffect(() => {
    if (!smartWalletAddress) return

    const fetchBalances = async () => {
      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http()
        })

        // Fetch PEPE balance
        // @ts-ignore - viem type issue with authorizationList
        const pepeValue = await publicClient.readContract({
          address: PEPE_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [smartWalletAddress]
        })
        
        // Fetch USDC balance
        // @ts-ignore - viem type issue with authorizationList
        const usdcValue = await publicClient.readContract({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [smartWalletAddress]
        })

        // Assuming 18 decimals for simplicity, but ideally should fetch decimals too
        setPepeBalance({ value: pepeValue, decimals: 18 })
        setUsdcBalance({ value: usdcValue, decimals: 18 })
      } catch (error) {
        console.error('Error fetching balances:', error)
      }
    }

    fetchBalances()
  }, [smartWalletAddress])

  if (!ready || !authenticated || !smartWalletAddress) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold text-white">Account Info</h2>
        </div>
        <p className="text-gray-400">Connect your wallet to view account details</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-white">Smart Account</h2>
      </div>

      {/* Smart Wallet Address */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Address</p>
        <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-sm text-gray-200 break-all">
          {smartWalletAddress}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Type: {smartWallet?.smartWalletType || 'kernel'}
        </p>
      </div>

      {/* Token Balances */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Token Balances</h3>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">PEPE</span>
            <span className="font-semibold text-white">
              {pepeBalance 
                ? `${parseFloat(formatUnits(pepeBalance.value, pepeBalance.decimals)).toFixed(2)}`
                : '0.00'
              }
            </span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">USDC</span>
            <span className="font-semibold text-white">
              {usdcBalance 
                ? `${parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2)}`
                : '0.00'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Gasless Badge */}
      <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
        <p className="text-green-400 text-sm font-medium">⚡ Gasless Transactions Enabled</p>
      </div>
    </div>
  )
}
