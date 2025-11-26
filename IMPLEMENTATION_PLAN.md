# Integrating Privy Login & ZeroDev Smart Account

## Goal Description
The user wants a gas‑less token swap (PEPE ↔ USDC) on Sepolia. The flow must use **Privy** for Google login, automatically create a **ZeroDev Smart Account** (EIP‑4337) for the logged‑in user, mint mock tokens to that account, approve them to a swap router and perform the swap using ZeroDev’s Paymaster.

## User Review Required
- **Privy API keys** (client ID & secret) must be added to the project’s `.env`.
- **ZeroDev API key** must be added to the project’s `.env`.
- Confirm the addresses of the mock token contracts (PEPE, USDC) and the router you intend to use on Sepolia.

## Proposed Changes
### Front‑end (React / Next)
- **src/app/providers.tsx** – Add `PrivyProvider` wrapper and expose `PrivyContext`.
- **src/lib/zerodev.ts** – Initialize ZeroDev SDK (`ZeroDevProvider.init`) with Sepolia chain ID and API key.
- **src/context/SmartAccountContext.tsx** (new file) – Create React context that, after a successful Privy login, calls `ZeroDevProvider.getSmartAccount` and stores the smart‑account address & signer.
- **src/components/AccountInfo.tsx** – Update to display `smartAccount.address` and token balances via `wagmi` hooks.
- **src/components/SwapCard.tsx** – Modify swap logic to use the `smartAccount` signer, approve tokens, and call the router’s `swapExactTokensForTokens`.
- **.env.local** – Add `NEXT_PUBLIC_PRIVY_APP_ID`, `NEXT_PUBLIC_PRIVY_LOGIN_URL`, `ZERODEV_API_KEY`, `NEXT_PUBLIC_SEPOLIA_RPC_URL`.
- **package.json** – Add dependencies: `@privy-io/react-auth`, `@zerodev/sdk`.

### Contracts (Solidity)
- **contracts/MockPEPE.sol** – ERC‑20 mock token (18 decimals).
- **contracts/MockUSDC.sol** – ERC‑20 mock token (6 decimals).
- **scripts/deploy-mocks.ts** – Hardhat script that deploys the two mock tokens, the UniswapV2 router (or a minimal router), and mints a supply to the newly created smart account address.
- **hardhat.config.ts** – Add Sepolia network configuration.

### CI / Testing
- Add a simple integration test (`test/privy-zero-dev.test.ts`) that:
  1. Mocks a Privy login flow (using Privy’s test utilities).
  2. Calls the ZeroDev SDK to obtain a smart account.
  3. Checks that the mock token balances are > 0 after the mint script.
  4. Executes a swap transaction and asserts the receipt status is `1`.
- Update `package.json` scripts: `npm run dev`, `npm run test`.

## Verification Plan
### Automated Tests
- **Run** `npm run test` – ensure the integration test passes.
- **Run** `npx hardhat run scripts/deploy-mocks.ts --network sepolia` – verify contracts are deployed and tokens minted.

### Manual Verification
1. Start the dev server: `npm run dev`.
2. Open `http://localhost:3000`.
3. Click **Login with Google** (Privy). After successful login, the UI should show a **Smart Account address**.
4. The token balances for PEPE and USDC should be displayed (non‑zero).
5. Perform a swap via the UI (e.g., swap 10 PEPE for USDC).
6. Observe a transaction hash and a link to Sepolia Etherscan; the transaction should be confirmed without the account holding ETH (gas‑less).
7. Verify the USDC balance increased accordingly.

### Edge Cases
- Attempt swap without prior token approval – UI should prompt to approve first.
- Login with a different Google account – a new smart account should be created automatically.

---
*All file paths referenced are relative to the repository root (`c:\Users\calle\Documents\GitHub\token-swap`).*
