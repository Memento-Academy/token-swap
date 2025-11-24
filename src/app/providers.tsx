'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets'
import { sepolia } from 'viem/chains'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#3b82f6',
        },

        defaultChain: sepolia,
        supportedChains: [sepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SmartWalletsProvider>
          {children}
        </SmartWalletsProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
