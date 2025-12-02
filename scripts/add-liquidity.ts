import { ethers } from "hardhat";

async function main() {
  const ROUTER_ADDRESS = "0x2efB63030B09CC5152F2F4B54C600d238bbf931E";
  const PEPE_ADDRESS = "0x0E189C460874370415Fc7eAdb3a00BFB9BaF104a";
  const USDC_ADDRESS = "0x3c37e10d6262c38aC6DD8A8F24C5580d22828DCe";

  const [deployer] = await ethers.getSigners();
  console.log("Checking liquidity with account:", deployer.address);

  // Get contract instances
  const router = await ethers.getContractAt("SimpleSwapRouter", ROUTER_ADDRESS);
  const pepe = await ethers.getContractAt("MockPEPE", PEPE_ADDRESS);
  const usdc = await ethers.getContractAt("MockUSDC", USDC_ADDRESS);

  // Check current reserves
  const pepeReserve = await router.getReserve(PEPE_ADDRESS);
  const usdcReserve = await router.getReserve(USDC_ADDRESS);

  console.log("\n📊 Current Router Reserves:");
  console.log("PEPE:", ethers.formatUnits(pepeReserve, 18));
  console.log("USDC:", ethers.formatUnits(usdcReserve, 6));

  // Add liquidity if needed
  const minPepeLiquidity = ethers.parseUnits("100000000", 18); // 100M PEPE
  const minUsdcLiquidity = ethers.parseUnits("10000", 6); // 10K USDC

  if (pepeReserve < minPepeLiquidity) {
    console.log("\n💧 Adding PEPE liquidity...");
    const pepeAmount = ethers.parseUnits("1000000000", 18); // 1B PEPE
    
    // Approve
    const approveTx = await pepe.approve(ROUTER_ADDRESS, pepeAmount);
    await approveTx.wait();
    console.log("✅ PEPE approved");
    
    // Add liquidity
    const addTx = await router.addLiquidity(PEPE_ADDRESS, pepeAmount);
    await addTx.wait();
    console.log("✅ PEPE liquidity added");
  }

  if (usdcReserve < minUsdcLiquidity) {
    console.log("\n💧 Adding USDC liquidity...");
    const usdcAmount = ethers.parseUnits("100000", 6); // 100K USDC
    
    // Approve
    const approveTx = await usdc.approve(ROUTER_ADDRESS, usdcAmount);
    await approveTx.wait();
    console.log("✅ USDC approved");
    
    // Add liquidity
    const addTx = await router.addLiquidity(USDC_ADDRESS, usdcAmount);
    await addTx.wait();
    console.log("✅ USDC liquidity added");
  }

  // Check final reserves
  const finalPepeReserve = await router.getReserve(PEPE_ADDRESS);
  const finalUsdcReserve = await router.getReserve(USDC_ADDRESS);

  console.log("\n📊 Final Router Reserves:");
  console.log("PEPE:", ethers.formatUnits(finalPepeReserve, 18));
  console.log("USDC:", ethers.formatUnits(finalUsdcReserve, 6));
  console.log("\n✅ Liquidity check complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
