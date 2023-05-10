import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await ethers.getNamedSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    const engine = await deploy("Engine", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });
    await deploy("Motorbike", {
      from: targetDeployer.address,
      args: [engine.address],
      log: true,
    });
  }

  await deploy("MotorbikeAttacker", {
    from: deployer.address,
    args: [],
    log: true,
  });

  log("All deployed! ");
};

deployment.tags = ["all", "motorbike"];

export default deployment;
