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

  let switchAddress = "0xAe94c3BD2f74E0CA75325dE0F0CF62a24F812448";

  if (isLocalTest) {
    const deployed = await deploy("Switch", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    switchAddress = deployed.address;
  }

  // deploy GatekeeperThreeAttacker
  await deploy("SwitchAttacker", {
    from: deployer.address,
    args: [switchAddress],
    log: true,
  });

  log("All deployed! ");
};

deployment.tags = ["all", "switch"];

export default deployment;
