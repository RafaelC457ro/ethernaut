import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DexTwo, SwappableTokenTwo } from "../typechain-types";

const deployment: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer, targetDeployer } = await ethers.getNamedSigners();

  const chainId = network.config.chainId;
  const isLocalTest = chainId === 31337;

  let dexAddress: string = "0x24D0a0137642498B849AA41aB1B33a8562FC7648";

  if (isLocalTest) {
    const dexDeployed = await deploy("DexTwo", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });
    dexAddress = dexDeployed.address;

    // add liquidity
    const dex: DexTwo = await ethers.getContractAt(
      "DexTwo",
      dexDeployed.address
    );

    // deploy coins
    const token1Deployed = await deploy("SwappableTokenTwo", {
      from: targetDeployer.address,
      args: [dexAddress, "FooCoin", "FOO", 110],
      log: true,
    });

    const token2Deployed = await deploy("SwappableTokenTwo", {
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
    const token1: SwappableTokenTwo = await ethers.getContractAt(
      "SwappableTokenTwo",
      token1Deployed.address
    );

    const token2: SwappableTokenTwo = await ethers.getContractAt(
      "SwappableTokenTwo",
      token2Deployed.address
    );

    await token1.connect(targetDeployer).transfer(deployer.address, 10);
    await token2.connect(targetDeployer).transfer(deployer.address, 10);

    // add liquidity
    await dex.connect(targetDeployer).approve(dex.address, 100);
    await dex
      .connect(targetDeployer)
      .add_liquidity(token1Deployed.address, 100);
    await dex
      .connect(targetDeployer)
      .add_liquidity(token2Deployed.address, 100);
    log("-----------------------------------------------------------------");
  }

  // deploy DexAttackerToken
  await deploy("DexAttackerToken", {
    from: deployer.address,
    args: ["DexAttackerToken", "DAT", 2000],
    log: true,
  });

  log("All deployed! ");
};

deployment.tags = ["all", "dex2"];

export default deployment;
