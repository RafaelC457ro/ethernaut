import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    const delegate = await deploy("Delegate", {
      from: targetDeployer,
      args: [targetDeployer],
      log: true,
    });

    await deploy("Delegation", {
      from: targetDeployer,
      args: [delegate.address],
      log: true,
    });
  }

  log("Delegation was deployed!");

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "delegation"];

export default deployment;
