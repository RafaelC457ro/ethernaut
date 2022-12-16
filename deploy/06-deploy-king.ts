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

  let kingAddress: string = "0x3a7a3b1a45CC4e58658f114F6db12D2C0481a0f1";

  if (isLocalTest) {
    const king = await deploy("King", {
      from: targetDeployer,
      args: [],
      log: true,
      value: ethers.utils.parseEther("0.00001"),
    });

    kingAddress = king.address;
  }

  log("---------------------------------------------------------");

  await deploy("KingAttacker", {
    from: deployer,
    args: [kingAddress],
    log: true,
  });

  log("KingAtacker deploed!");
};

deployment.tags = ["all", "king"];

export default deployment;
