import { ethers, network } from "hardhat";
import { NaughtCoin } from "../typechain-types";

async function main() {
  let naughtCoin: NaughtCoin;
  const [deployer, , thirdDeployer] = await ethers.getSigners();
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    naughtCoin = await ethers.getContract("NaughtCoin");
  } else {
    naughtCoin = await ethers.getContractAt(
      "NaughtCoin",
      "0x4Fe7Deebc5621Fa0D1eA688606c22a45088D356a"
    );
  }

  async function check() {
    const funds = await naughtCoin.balanceOf(deployer.address);
    console.log(funds.toString());
  }

  await check();

  const amount = await naughtCoin.balanceOf(deployer.address);
  // deployer approve other address
  const tx = await naughtCoin
    .connect(deployer)
    .approve(thirdDeployer.address, amount);
  await tx.wait(isLocalTest ? 1 : 5);

  const tx2 = await naughtCoin
    .connect(thirdDeployer)
    .transferFrom(deployer.address, thirdDeployer.address, amount);
  // other address transferFrom
  await tx2.wait(isLocalTest ? 1 : 5);

  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
