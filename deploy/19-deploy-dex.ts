import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Dex, SwappableToken } from "../typechain-types";

const deployment: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await ethers.getNamedSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  let dexAddress: string = "0x657C2bE5232c91176738E67dfA073703423b158a";

  if (isLocalTest) {
    const dexDeployed = await deploy("Dex", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });
    dexAddress = dexDeployed.address;

    // add liquidity
    const dex: Dex = await ethers.getContractAt("Dex", dexDeployed.address);

    // deploy coins
    const token1Deployed = await deploy("SwappableToken", {
      from: targetDeployer.address,
      args: [dexAddress, "FooCoin", "FOO", 110],
      log: true,
    });

    const token2Deployed = await deploy("SwappableToken", {
      from: targetDeployer.address,
      args: [dexAddress, "BarCoin", "BAR", 110],
      log: true,
      skipIfAlreadyDeployed: false,
    });

    // set tokens
    await dex
      .connect(targetDeployer)
      .setTokens(token1Deployed.address, token2Deployed.address);

    // transfer 10 to the attacker
    const token1: SwappableToken = await ethers.getContractAt(
      "SwappableToken",
      token1Deployed.address
    );

    const token2: SwappableToken = await ethers.getContractAt(
      "SwappableToken",
      token2Deployed.address
    );

    await token1.connect(targetDeployer).transfer(deployer.address, 10);
    await token2.connect(targetDeployer).transfer(deployer.address, 10);

    // add liquidity
    await dex.connect(targetDeployer).approve(dex.address, 100);
    await dex.connect(targetDeployer).addLiquidity(token1Deployed.address, 100);
    await dex.connect(targetDeployer).addLiquidity(token2Deployed.address, 100);
    log("-----------------------------------------------------------------");

    log("Deploing dex attacker...");

    log("All deployed! ");
  }
};

deployment.tags = ["all", "dex"];

export default deployment;
