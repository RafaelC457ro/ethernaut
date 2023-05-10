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

  let goodSamaritanAddress = "0x02a677d2ecA1d4406FaBa696E849ebF0882ACaE6";

  if (isLocalTest) {
    const goodSamaritan = await deploy("GoodSamaritan", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    goodSamaritanAddress = goodSamaritan.address;
  }

  // deploy the attacker contract
  await deploy("GoodSamaritanAttacker", {
    from: deployer.address,
    args: [goodSamaritanAddress],
    log: true,
  });

  log("All deployed! ");
};

deployment.tags = ["all", "good-samaritan"];

export default deployment;
