'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { parseUnits, encodeFunctionData, parseAbi } from 'viem'
import { ArrowDownUp, Loader2 } from 'lucide-react'

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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Swap Tokens</h2>

      {/* From Token */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block">From</label>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as 'PEPE' | 'USDC')}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="PEPE">PEPE</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-white text-2xl font-semibold focus:outline-none"
            disabled={!authenticated}
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleFlipTokens}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full border-4 border-gray-800 transition-all"
          disabled={!authenticated}
        >
          <ArrowDownUp size={20} />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">To</label>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value as 'PEPE' | 'USDC')}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="PEPE">PEPE</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
          <div className="text-2xl font-semibold text-gray-400">
            {amount || '0.0'}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!authenticated || !amount || isSwapping || fromToken === toToken}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
      >
        {isSwapping ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Swapping...
          </>
        ) : (
          'Swap'
        )}
      </button>

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-green-400 text-sm font-medium mb-1">✓ Swap Successful!</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs break-all underline"
          >
            View on Explorer: {txHash}
          </a>
        </div>
      )}

      {/* Gasless Info */}
      {authenticated && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            ⚡ This transaction is <span className="text-green-400 font-semibold">gasless</span> - no ETH required!
          </p>
        </div>
      )}
    </div>
  )
}
