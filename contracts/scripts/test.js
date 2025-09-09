const hre = require("hardhat");

async function main() {
  console.log("hre object:", Object.keys(hre));
  console.log("hre.ethers:", hre.ethers);
  
  if (hre.ethers) {
    console.log("ethers methods:", Object.keys(hre.ethers));
  }
  
  // Try alternative access
  try {
    const ethers = require("ethers");
    console.log("Direct ethers import works");
  } catch (e) {
    console.log("Direct ethers import failed:", e.message);
  }
}

main().catch(console.error);