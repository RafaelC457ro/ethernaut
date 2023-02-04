import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    await deploy("MagicNum", {
      from: targetDeployer,
      args: [],
      log: true,
    });
  }

  log("---------------------------------------------------------");

  await deploy("SolverDeployer", {
    from: deployer,
    args: [],
    log: true,
  });

  log("SolverDeployer deployed!");
};

deployment.tags = ["all", "magic-num"];

export default deployment;
