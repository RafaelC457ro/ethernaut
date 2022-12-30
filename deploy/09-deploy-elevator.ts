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
  let elevatorAddress = "0x52fAA1Cd6a9E395A88Aa197fe56042fe7814296F";

  if (isLocalTest) {
    const elevator = await deploy("Elevator", {
      from: targetDeployer,
      args: [],
      log: true,
    });
    elevatorAddress = elevator.address;
  }

  log("---------------------------------------------------------");

  await deploy("BuildingAttack", {
    from: deployer,
    args: [elevatorAddress],
    log: true,
  });

  log("BuidingAttack deployed!");
};

deployment.tags = ["all", "elevator"];

export default deployment;
