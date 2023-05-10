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

  let gateKeeperTreeAddress = "0x4B5750bfBFaFDB7f79A6DBBf233e54DbC14185d9";

  if (isLocalTest) {
    const gateKeeperThree = await deploy("GatekeeperThree", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    gateKeeperTreeAddress = gateKeeperThree.address;
  }

  // deploy GatekeeperThreeAttacker
  await deploy("GatekeeperThreeAttacker", {
    from: deployer.address,
    args: [gateKeeperTreeAddress],
    log: true,
  });

  log("All deployed! ");
};

deployment.tags = ["all", "gatekeeper-three"];

export default deployment;
