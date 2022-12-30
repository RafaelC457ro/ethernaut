import { network, ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { targetDeployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    const data = [
      ethers.utils.formatBytes32String("foo"),
      ethers.utils.formatBytes32String("AAAAA"),
      ethers.utils.formatBytes32String("bar"),
    ];

    console.log(data);
    await deploy("Privacy", {
      from: targetDeployer,
      args: [data],
      log: true,
    });
  }
};

deployment.tags = ["all", "privacy"];

export default deployment;
