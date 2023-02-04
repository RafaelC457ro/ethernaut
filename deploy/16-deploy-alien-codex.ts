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

  let alienCodexAddress: string = "0xBdE3807e8DC483cc1a0B2742f98FAB714a1dba26";

  if (isLocalTest) {
    const alienCodex = await deploy("AlienCodex", {
      from: targetDeployer,
      args: [],
      log: true,
    });
    alienCodexAddress = alienCodex.address;
  }

  log("---------------------------------------------------------");

  await deploy("AlienCodexAttacker", {
    from: deployer,
    args: [alienCodexAddress],
    log: true,
  });

  log("AlienCodexAttacker deployed!");
};

deployment.tags = ["all", "alien-codex"];

export default deployment;
