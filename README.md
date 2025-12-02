# Token Swap dApp

A gasless token swap decentralized application built with Next.js, Privy, and ZeroDev on Ethereum Sepolia testnet.

## 🌟 Features

- **Gasless Transactions**: Users don't need ETH to perform swaps or claim tokens
- **Smart Account Integration**: Uses ZeroDev Kernel v3 for account abstraction
- **Social Login**: Easy authentication via Privy (email, social, or wallet)
- **Token Faucet**: Get test tokens (PEPE & USDC) with one click
- **Token Swap**: Exchange PEPE ↔ USDC at a fixed rate (1 PEPE = 0.000011 USDC)
- **Real-time Balance Updates**: Automatic balance refresh after transactions
- **Beautiful UI**: Modern, responsive design with glassmorphism effects

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Viem** - Ethereum interactions
- **Privy** - Authentication & wallet management
- **ZeroDev SDK** - Smart account & gasless transactions

### Smart Contracts
- **Solidity 0.8.20** - Contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries

### Blockchain
- **Ethereum Sepolia** - Testnet deployment
- **ERC-4337** - Account abstraction standard

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet (for deployment only)
- Alchemy API key
- Privy App ID
- ZeroDev Project ID

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd token-swap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# ZeroDev Configuration
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_zerodev_project_id
NEXT_PUBLIC_ZERODEV_BUNDLER_URL=https://rpc.zerodev.app/api/v3/YOUR_PROJECT_ID/chain/11155111
NEXT_PUBLIC_ZERODEV_PAYMASTER_URL=https://rpc.zerodev.app/api/v3/YOUR_PROJECT_ID/chain/11155111?selfFunded=true

# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Network Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Contract Addresses (will be populated after deployment)
NEXT_PUBLIC_PEPE_ADDRESS=
NEXT_PUBLIC_USDC_ADDRESS=
NEXT_PUBLIC_ROUTER_ADDRESS=

# Deployment (for Hardhat)
PRIVATE_KEY=your_private_key_for_deployment
```

### 4. Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy-mocks.ts --network sepolia
```

After deployment, copy the contract addresses to your `.env.local`:
- `NEXT_PUBLIC_PEPE_ADDRESS`
- `NEXT_PUBLIC_USDC_ADDRESS`
- `NEXT_PUBLIC_ROUTER_ADDRESS`

### 5. Add Liquidity to Router

```bash
npx hardhat run scripts/add-liquidity.js --network sepolia
```

This adds initial liquidity (1B PEPE + 1M USDC) to the swap router.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
token-swap/
├── contracts/              # Smart contracts
│   ├── MockPEPE.sol       # PEPE token (18 decimals)
│   ├── MockUSDC.sol       # USDC token (6 decimals)
│   └── SimpleSwapRouter.sol # Token swap router
├── scripts/               # Deployment scripts
│   ├── deploy-mocks.ts    # Deploy contracts
│   └── add-liquidity.js   # Add router liquidity
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── AccountInfo.tsx      # Account & faucet
│   │   ├── SwapCard.tsx         # Swap interface
│   │   ├── ConnectWallet.tsx    # Auth button
│   │   ├── FaucetModal.tsx      # Faucet status modal
│   │   └── SwapLoadingModal.tsx # Swap status modal
│   ├── context/          # React context
│   │   └── SmartAccountContext.tsx # ZeroDev integration
│   └── lib/              # Utilities
│       └── zerodev.ts    # ZeroDev client setup
└── hardhat.config.ts     # Hardhat configuration
```

## 🎮 How to Use

### 1. Connect Wallet
- Click "Connect Wallet"
- Choose your preferred login method (email, social, or wallet)
- A smart account will be created automatically

### 2. Get Test Tokens
- Click "Get Test Tokens" in the Account Info section
- Approve the transaction (gasless!)
- Receive 9,090,909 PEPE + 100 USDC

### 3. Swap Tokens
- Enter the amount or click "MAX"
- Select tokens to swap (PEPE ↔ USDC)
- Click "Swap"
- Approve the transaction
- Wait for confirmation

## 💡 Key Concepts

### Gasless Transactions
The app uses ZeroDev's paymaster to sponsor gas fees, allowing users to interact without holding ETH.

### Smart Accounts
Each user gets a Kernel v3 smart account that supports:
- Batched transactions
- Session keys
- Social recovery
- Gas sponsorship

### Exchange Rate
The swap uses a fixed rate:
- **1 PEPE = 0.000011 USDC**
- **1 USDC = ~90,909 PEPE**

### Faucet Limits
- **PEPE**: Max 100M tokens per request
- **USDC**: Max 100M tokens per request
- Requests: 9,090,909 PEPE + 100 USDC per click

## 🔧 Smart Contracts

### MockPEPE
ERC-20 token with 18 decimals and a public faucet function.

### MockUSDC
ERC-20 token with 6 decimals (matching real USDC) and a public faucet function.

### SimpleSwapRouter
A simple DEX router that:
- Swaps tokens at a fixed rate
- Handles different decimal precisions
- Requires sufficient liquidity

## 🧪 Testing

```bash
# Run Hardhat tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```

## 🌐 Deployed Contracts (Sepolia)

- **PEPE**: `0x0E189C460874370415Fc7eAdb3a00BFB9BaF104a`
- **USDC**: `0x3c37e10d6262c38aC6DD8A8F24C5580d22828DCe`
- **Router**: `0x2efB63030B09CC5152F2F4B54C600d238bbf931E`

## 🔐 Security Considerations

⚠️ **This is a testnet demo application. DO NOT use in production without:**
- Comprehensive security audits
- Proper access controls
- Rate limiting
- Slippage protection
- Oracle price feeds
- Emergency pause mechanisms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Privy](https://privy.io) - Authentication
- [ZeroDev](https://zerodev.app) - Account abstraction
- [Alchemy](https://alchemy.com) - RPC provider
- [OpenZeppelin](https://openzeppelin.com) - Smart contract libraries

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Privy, and ZeroDev
