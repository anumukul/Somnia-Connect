const { ethers } = require("ethers");

async function main() {
  // Create provider (ethers v6 syntax)
  const provider = new ethers.JsonRpcProvider("https://dream-rpc.somnia.network");
  
  // Create wallet with your private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const userProgressAddress = "0x7f228c7A5708b4d4F7BACe7A6A585C2f3C9495Aa";
  const rewardSystemAddress = "0x0A816c723128D70fBd68bC6433a64271D512D02A";

  // Load the RewardSystem ABI
  const RewardSystemArtifact = require("../artifacts/contracts/RewardSystem.sol/RewardSystem.json");
  
  const rewardSystemContract = new ethers.Contract(
    rewardSystemAddress,
    RewardSystemArtifact.abi,
    wallet
  );
  
  console.log("Connecting RewardSystem to UserProgress...");
  console.log("Using wallet:", wallet.address);
  
  const tx = await rewardSystemContract.setUserProgressContract(userProgressAddress);
  console.log("Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("Contracts connected successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});