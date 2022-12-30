import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Reentrance } from "../typechain-types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  let reentraceAddress: string = "0xaFf1971520934C2E9931673d1d9B66eAb4B8A1d7";

  if (isLocalTest) {
    const reentrace = await deploy("Reentrance", {
      from: targetDeployer,
      args: [],
      log: true,
    });

    const token: Reentrance = await ethers.getContract(
      "Reentrance",
      targetDeployer
    );

    await token.donate(targetDeployer, {
      value: ethers.utils.parseEther("0.001"),
    });

    reentraceAddress = reentrace.address;
  }

  log("---------------------------------------------------------");

  await deploy("ReentranceAttacker", {
    from: deployer,
    args: [reentraceAddress],
    log: true,
  });

  log("ReentranceAttacker deployed!");
};

deployment.tags = ["all", "reentrance"];

export default deployment;
