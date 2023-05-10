import { ethers, network } from "hardhat";
import { SwitchAttacker } from "../typechain-types";

async function main() {
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const switchAttacker: SwitchAttacker = await ethers.getContract(
    "SwitchAttacker"
  );

  async function check() {
    const on = await switchAttacker.getSwitchOn();
    console.log(`on: ${on}`);
  }

  console.log("Before the attack:");

  await check();

  const tx = await switchAttacker.attack();

  console.log("tx: ", tx.hash);

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
