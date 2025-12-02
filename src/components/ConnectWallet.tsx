'use client'

import { usePrivy, useLogin, useLogout } from '@privy-io/react-auth'
import { LogIn, LogOut } from 'lucide-react'

export function ConnectWallet() {
  const { ready, authenticated, user } = usePrivy()
  const { login } = useLogin()
  const { logout } = useLogout()

  if (!ready) {
    return (
      <button 
        disabled 
        className="bg-gray-700 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  if (!authenticated) {
    return (
      <button 
        onClick={login}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
      >
        <LogIn size={20} />
        Connect Wallet
      </button>
    )
  }

  // Get smart wallet address if available
  const smartWallet = user?.linkedAccounts?.find(
    (account) => account.type === 'smart_wallet'
  )
  
  const displayAddress = smartWallet?.address 
    ? `${smartWallet.address.slice(0, 6)}...${smartWallet.address.slice(-4)}`
    : 'Connected'

  return (
    <div className="flex gap-3 items-center">
      <div className="bg-green-900/30 text-green-300 py-2 px-4 rounded-lg border border-green-600/50">
        {displayAddress}
      </div>
      <button 
        onClick={logout}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 border border-gray-600 hover:border-gray-500"
      >
        <LogOut size={20} />
        Disconnect
      </button>
    </div>
  )
}
