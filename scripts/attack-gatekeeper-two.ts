import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { GatekeeperTwo } from "../typechain-types";

async function main() {
  let gateKeeperTwo: GatekeeperTwo;

  const chainId = network.config.chainId;
  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    gateKeeperTwo = await ethers.getContract("GatekeeperTwo");
  } else {
    gateKeeperTwo = await ethers.getContractAt(
      "GatekeeperTwo",
      "0x442ee833A30411a1C5f056fF3aC5EDD781f90E34"
    );
  }

  async function check() {
    const entrant = await gateKeeperTwo.entrant();
    console.log(entrant);
  }

  await check();

  const Lock = await ethers.getContractFactory("GatekeeperTwoAttacker");
  const lock = await Lock.deploy(gateKeeperTwo.address);

  await lock.deployed();

  //await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After attack:");

  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
