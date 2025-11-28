const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Check if we have enough balance
  const balance = await deployer.getBalance();
  if (balance.eq(0)) {
    console.error("❌ Error: Account has 0 balance. Please fund it with Sepolia ETH from https://sepoliafaucet.com/");
    process.exit(1);
  }
  
  console.log("\nDeploying MockPEPE...");
  const MockPEPE = await ethers.getContractFactory("MockPEPE");
  const pepe = await MockPEPE.deploy();
  await pepe.deployed();
  console.log("✅ MockPEPE deployed to:", pepe.address);

  console.log("\nDeploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.deployed();
  console.log("✅ MockUSDC deployed to:", usdc.address);

  console.log("\nDeploying SimpleSwapRouter...");
  const SimpleSwapRouter = await ethers.getContractFactory("SimpleSwapRouter");
  const router = await SimpleSwapRouter.deploy(pepe.address, usdc.address);
  await router.deployed();
  console.log("✅ SimpleSwapRouter deployed to:", router.address);

  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Add these to your .env.local:");
  console.log(`NEXT_PUBLIC_PEPE_ADDRESS=${pepe.address}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${usdc.address}`);
  console.log(`NEXT_PUBLIC_ROUTER_ADDRESS=${router.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
