import { ConnectWallet } from '../components/ConnectWallet'
import { AccountInfo } from '../components/AccountInfo'
import { SwapCard } from '../components/SwapCard'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              ⚡ Gasless Token Swap
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Swap tokens without holding any ETH
            </p>
          </div>
          <ConnectWallet />
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Account Info */}
          <AccountInfo />

          {/* Swap Card */}
          <SwapCard />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass-effect inline-block px-6 py-3 rounded-full">
            <p className="text-gray-300 text-sm">
              Powered by <span className="text-blue-400 font-semibold">Privy</span> + <span className="text-purple-400 font-semibold">ZeroDev</span> | Sepolia Testnet
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
