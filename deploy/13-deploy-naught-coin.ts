import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer, targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    await deploy("NaughtCoin", {
      from: targetDeployer,
      args: [deployer],
      log: true,
    });
  }
};

deployment.tags = ["all", "naught-coin"];

export default deployment;
