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
  let geteKeeperAddress = "0xaE6Eb3eea224961e64B8b5e6C3536040eE863e3D";

  if (isLocalTest) {
    const gateKeeperOne = await deploy("GatekeeperOne", {
      from: targetDeployer,
      args: [],
      log: true,
    });
    geteKeeperAddress = gateKeeperOne.address;
  }

  log("---------------------------------------------------------");

  await deploy("GatekeeperOneAttacker", {
    from: deployer,
    args: [geteKeeperAddress],
    log: true,
  });

  log("GatekeeperOneAttack deployed!");
};

deployment.tags = ["all", "gatekeeper"];

export default deployment;
