'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { parseUnits, encodeFunctionData, parseAbi } from 'viem'
import { ArrowDownUp, Loader2, ExternalLink } from 'lucide-react'

// Token addresses on Sepolia
const PEPE_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

// ERC-20 ABI for approve and transfer
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)'
])

export function SwapCard() {
  const { authenticated } = usePrivy()
  // Cast to any to avoid "Type instantiation is excessively deep" error with viem types
  const { client } = useSmartWallets() as { client: any }
  
  const [fromToken, setFromToken] = useState<'PEPE' | 'USDC'>('PEPE')
  const [toToken, setToToken] = useState<'PEPE' | 'USDC'>('USDC')
  const [amount, setAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleSwap = async () => {
    if (!authenticated || !client || !amount) {
      return
    }

    try {
      setIsSwapping(true)
      setTxHash(null)

      const fromAddress = fromToken === 'PEPE' ? PEPE_ADDRESS : USDC_ADDRESS
      const toAddress = toToken === 'PEPE' ? PEPE_ADDRESS : USDC_ADDRESS
      
      // Parse amount (assuming 18 decimals for both tokens)
      const amountWei = parseUnits(amount, 18)

      // For demo purposes, we'll just do a simple transfer
      // In a real app, you'd interact with a DEX contract
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, amountWei],
      })

      // Send transaction using Privy smart wallet client
      const hash = await client.sendTransaction({
        to: fromAddress as `0x${string}`,
        data,
        value: 0n,
      })

      setTxHash(hash)
      setAmount('')
    } catch (error) {
      console.error('Swap failed:', error)
      alert('Swap failed. Check console for details.')
    } finally {
      setIsSwapping(false)
    }
  }

  const handleFlipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <div className="glass-effect-strong rounded-3xl p-6 md:p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Swap Tokens
      </h2>

      {/* From Token */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block font-medium">From</label>
        <div className="glass-effect rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as 'PEPE' | 'USDC')}
              className="bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:border-blue-400 transition-colors font-medium cursor-pointer hover:bg-white/15"
              disabled={!authenticated}
            >
              <option value="PEPE" className="bg-gray-900">🐸 PEPE</option>
              <option value="USDC" className="bg-gray-900">$ USDC</option>
            </select>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-white text-3xl font-bold focus:outline-none placeholder-gray-600"
            disabled={!authenticated}
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleFlipTokens}
          className="glass-effect-strong p-3 rounded-2xl border-4 border-gray-900/50 transition-all hover:scale-110 hover:rotate-180 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
          disabled={!authenticated}
        >
          <ArrowDownUp className="text-blue-400" size={24} />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block font-medium">To</label>
        <div className="glass-effect rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value as 'PEPE' | 'USDC')}
              className="bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:border-purple-400 transition-colors font-medium cursor-pointer hover:bg-white/15"
              disabled={!authenticated}
            >
              <option value="PEPE" className="bg-gray-900">🐸 PEPE</option>
              <option value="USDC" className="bg-gray-900">$ USDC</option>
            </select>
          </div>
          <div className="text-3xl font-bold text-gray-400">
            {amount || '0.0'}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!authenticated || !amount || isSwapping || fromToken === toToken}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
      >
        {isSwapping ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Swapping...
          </>
        ) : (
          'Swap'
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
            ⚡ This transaction is <span className="text-green-400 font-semibold">gasless</span> - no ETH required!
          </p>
        </div>
      )}
    </div>
  )
}
