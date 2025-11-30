import { 
  createKernelAccount, 
  createKernelAccountClient, 
  createZeroDevPaymasterClient 
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { http, createPublicClient, custom, WalletClient, Address, Transport, Chain } from "viem";
import { sepolia } from "viem/chains";

// Permissionless v0.2 doesn't export v0.7 entrypoint, but ZeroDev v5 uses it.
// We hardcode it here to avoid conflicts with Privy's dependency.
const ENTRYPOINT_ADDRESS_V07 = "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as Address;
const ENTRYPOINT_VERSION = "0.7" as const;

const ENTRYPOINT_V07 = {
  address: ENTRYPOINT_ADDRESS_V07,
  version: ENTRYPOINT_VERSION,
} as const;

if (!process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_ZERODEV_PROJECT_ID');
}

const PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID;
const BUNDLER_URL = process.env.NEXT_PUBLIC_ZERODEV_BUNDLER_URL || `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/11155111`;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_ZERODEV_PAYMASTER_URL || `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/11155111`;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;

export const publicClient = createPublicClient({
  transport: http(RPC_URL),
  chain: sepolia,
});

export const createZeroDevClient = async (walletClient: WalletClient) => {
  try {
    const ecdsaValidator = await signerToEcdsaValidator(publicClient as any, {
      signer: walletClient as any,
      entryPoint: ENTRYPOINT_V07 as any,
      kernelVersion: "0.3.1" as any,
    });

    const account = await createKernelAccount(publicClient as any, {
      plugins: {
        sudo: ecdsaValidator,
      },
      entryPoint: ENTRYPOINT_V07 as any,
      kernelVersion: "0.3.1" as any,
    });

    const paymasterClient = createZeroDevPaymasterClient({
      chain: sepolia,
      transport: http(PAYMASTER_URL),
    });

    const kernelClient = createKernelAccountClient({
      account,
      chain: sepolia as Chain,
      bundlerTransport: http(BUNDLER_URL) as Transport,
      paymaster: {
        getPaymasterData(userOperation) {
          return paymasterClient.sponsorUserOperation({ userOperation });
        },
      },
    });

    console.log('✅ ZeroDev client created successfully');
    console.log('Account address:', account.address);
    console.log('EntryPoint:', account.entryPoint);

    return { account, kernelClient };
  } catch (error) {
    console.error('❌ Error in createZeroDevClient:', error);
    throw error;
  }
};
