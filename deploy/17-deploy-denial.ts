import { ethers, network } from "hardhat";
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

  let denialAddress: string = "0x0bB3f55f6d63D28caB5F29b5b541631c0e212317";

  if (isLocalTest) {
    const denial = await deploy("Denial", {
      from: targetDeployer,
      args: [],
      log: true,
    });
    denialAddress = denial.address;
  }

  log("---------------------------------------------------------");

  await deploy("DenialAttacker", {
    from: deployer,
    args: [denialAddress],
    log: true,
  });

  log("DenialAttacker deployed!");
};

deployment.tags = ["all", "denial"];

export default deployment;
