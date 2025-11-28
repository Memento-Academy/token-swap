'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createZeroDevClient } from '@/lib/zerodev';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

interface SmartAccountContextType {
  smartAccountAddress: string | null;
  kernelClient: any | null;
  isLoading: boolean;
  error: Error | null;
}

const SmartAccountContext = createContext<SmartAccountContextType>({
  smartAccountAddress: null,
  kernelClient: null,
  isLoading: false,
  error: null,
});

export const useSmartAccount = () => useContext(SmartAccountContext);

export const SmartAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, user, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [kernelClient, setKernelClient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupSmartAccount = async () => {
      if (!authenticated || !user) {
        return;
      }

      // Check if user already has an embedded wallet linked
      const hasEmbeddedWallet = user.linkedAccounts.some(
        (account) => account.type === 'wallet' && account.walletClientType === 'privy'
      );

      setIsLoading(true);
      setError(null);

      try {
        let wallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];
        
        if (!wallet) {
          if (hasEmbeddedWallet) {
             console.log('⏳ Waiting for wallet to sync...');
             return;
          }

          try {
            await createWallet();
            // Don't proceed with this execution, wait for useWallets to update and re-trigger useEffect
            return;
          } catch (createError) {
             console.error('❌ Failed to create embedded wallet:', createError);
             // If createWallet fails because it exists (race condition), we just wait
             if (wallets.length === 0) {
                 console.log('⏳ Waiting for wallet to sync (fallback)...');
                 return;
             }
          }
        }
        
        // Re-check wallet after potential creation
        wallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];

        if (!wallet) {
          return;
        }

        if (typeof wallet.getEthereumProvider !== 'function') {
            throw new Error('Wallet object is malformed or missing getEthereumProvider');
        }

        const provider = await wallet.getEthereumProvider();
        
        // Create a Viem WalletClient from the Privy provider
        const walletClient = createWalletClient({
          account: wallet.address as `0x${string}`,
          chain: sepolia,
          transport: custom(provider)
        });

        const { account, kernelClient } = await createZeroDevClient(walletClient);
        
        setKernelClient(kernelClient);
        setSmartAccountAddress(account.address);
        
      } catch (err: any) {
        console.error('❌ Error creating smart account:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    setupSmartAccount();
  }, [authenticated, user?.id, wallets.length]); // Use user.id to avoid unnecessary re-runs

  return (
    <SmartAccountContext.Provider
      value={{
        smartAccountAddress,
        kernelClient,
        isLoading,
        error,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
};
