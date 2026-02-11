import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const networkName = network.name;
  console.log(`Deploying to network: ${networkName}`);

  const BadgeRegistry = await ethers.getContractFactory("BadgeRegistry");
  const registry = await BadgeRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`BadgeRegistry deployed to: ${address}`);

  // Determine RPC URL for the deployment config
  let rpcUrl = "http://127.0.0.1:8545";
  if (networkName === "sepolia") {
    rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  }

  const deploymentInfo = {
    address,
    network: networkName,
    rpcUrl,
    chainId: networkName === "sepolia" ? 11155111 : 31337,
    deployedAt: new Date().toISOString(),
  };

  const dataDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, "contract-deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to data/contract-deployment.json");

  // For Sepolia, print Etherscan link
  if (networkName === "sepolia") {
    console.log(`\nVerify on Etherscan: https://sepolia.etherscan.io/address/${address}`);
    console.log("Note: Wait ~1 minute for the contract to be indexed.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
