import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const GroupSavingsEscrow = await ethers.getContractFactory("GroupSavingsEscrow");
  const groupSavingsEscrow = await GroupSavingsEscrow.deploy();

  await groupSavingsEscrow.waitForDeployment();

  console.log("GroupSavingsEscrow deployed to:", await groupSavingsEscrow.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 