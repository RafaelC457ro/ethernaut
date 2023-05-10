import { ethers, network } from "hardhat";
import { GoodSamaritanAttacker } from "../typechain-types";

async function main() {
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const goodSamaritanAttacker: GoodSamaritanAttacker = await ethers.getContract(
    "GoodSamaritanAttacker"
  );

  async function check() {
    const balance = await goodSamaritanAttacker.getWalletBalance();
    console.log(`balance: ${balance.toString()}`);
  }

  console.log("Before the attack:");

  await check();

  const tx = await goodSamaritanAttacker.attack();

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
