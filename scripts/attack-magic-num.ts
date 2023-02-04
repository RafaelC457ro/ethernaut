import { ethers, network } from "hardhat";
import { MagicNum, SolverDeployer } from "../typechain-types";

async function main() {
  let magicNum: MagicNum;
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const solverDeployer: SolverDeployer = await ethers.getContract(
    "SolverDeployer"
  );

  if (isLocalTest) {
    magicNum = await ethers.getContract("MagicNum");
  } else {
    magicNum = await ethers.getContractAt(
      "MagicNum",
      "0xD75D6BBF60360d1a9b5dca85823424cb112C571f"
    );
  }

  /**
   *  In order to solve this challange it was necessary learn about EVM asssembly
   *  sources: https://mirror.xyz/0xB38709B8198d147cc9Ff9C133838a044d78B064B/Hh69VJWM5eiFYFINxYWrIYWcRRtPm8tw3VFjpdpx6T8
   *  after that I coded a yul file that run the initial contract init and the runtime that returns 42. (see utils/Solver.yul)
   *  and compiled using solc compiler
   *  command:
   *  solc --strict-assembly --optimize --optimize-runs 200 Solver.yul > dump
   *  which generated the bytecode: 0x600a80600c6000396000f3fe602a60805260206080f3
   */

  const tx = await solverDeployer.deploy(
    "0x600a80600c6000396000f3fe602a60805260206080f3" // minimal contract
  );

  console.log("Deploying hash: ");

  console.log(tx.hash);

  await tx.wait(isLocalTest ? 1 : 5);

  const solverAddress = await solverDeployer.solver();

  const tx2 = await magicNum.setSolver(solverAddress);

  console.log("Set solver hash: ");

  console.log(tx2.hash);

  await tx2.wait(isLocalTest ? 1 : 5);
  // should be a sucesss

  console.log("Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
