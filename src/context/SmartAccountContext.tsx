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
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [kernelClient, setKernelClient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupSmartAccount = async () => {
      if (!authenticated || !user || wallets.length === 0) {
        return;
      }

      const wallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];
      if (!wallet) return;

      setIsLoading(true);
      setError(null);

      try {
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
        
        console.log('Smart Account created:', account.address);
      } catch (err: any) {
        console.error('Error creating smart account:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    setupSmartAccount();
  }, [authenticated, user, wallets]);

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
