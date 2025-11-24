import { ConnectWallet } from '../components/ConnectWallet'
import { AccountInfo } from '../components/AccountInfo'
import { SwapCard } from '../components/SwapCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white">
            ⚡ Gasless Token Swap
          </h1>
          <ConnectWallet />
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Account Info */}
          <AccountInfo />

          {/* Swap Card */}
          <SwapCard />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Powered by Privy + ZeroDev | Sepolia Testnet</p>
        </footer>
      </div>
    </main>
  )
}
