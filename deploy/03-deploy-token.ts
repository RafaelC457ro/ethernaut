import { network, ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Token } from "../typechain-types/target";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    await deploy("Token", {
      from: targetDeployer,
      args: [21000000],
      log: true,
    });

    const token: Token = await ethers.getContract("Token", targetDeployer);
    await token.transfer(deployer, 20);
  }

  log("Token was deployed!");

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "token"];

export default deployment;
