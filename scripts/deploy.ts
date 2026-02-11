import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const BadgeRegistry = await ethers.getContractFactory("BadgeRegistry");
  const registry = await BadgeRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`BadgeRegistry deployed to: ${address}`);

  const deploymentInfo = {
    address,
    network: "localhost",
    deployedAt: new Date().toISOString(),
  };

  const dataDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, "contract-deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to data/contract-deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
