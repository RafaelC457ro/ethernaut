import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DoubleEntryPoint } from "../typechain-types";

const deployment: DeployFunction = async function ({
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer: atacker, targetDeployer } = await ethers.getNamedSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  let doubleEntryPointAddress = "0xd6C935D9921141C7790D821A6b91B13E4C66E227";

  if (isLocalTest) {
    // deploy LegacyToken
    const legacyToken = await deploy("LegacyToken", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    // deploy Forta
    const forta = await deploy("Forta", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    // deploy CryptoValt

    const cryptoVaultDeployed = await deploy("CryptoVault", {
      from: targetDeployer.address,
      args: [atacker.address],
      log: true,
    });

    // deploy DoubleEntryPoint
    const doubleEntryPoint = await deploy("DoubleEntryPoint", {
      from: targetDeployer.address,
      args: [
        legacyToken.address,
        cryptoVaultDeployed.address,
        forta.address,
        atacker.address,
      ],
      log: true,
    });

    doubleEntryPointAddress = doubleEntryPoint.address;

    // get LegacyToken contract
    const legacyTokenContract = await ethers.getContractAt(
      "LegacyToken",
      legacyToken.address
    );
    // get CryptoVault contract
    const cryptoVault = await ethers.getContractAt(
      "CryptoVault",
      cryptoVaultDeployed.address
    );

    // setUnderlying
    await cryptoVault
      .connect(targetDeployer)
      .setUnderlying(doubleEntryPoint.address);

    await legacyTokenContract
      .connect(targetDeployer)
      .delegateToNewContract(doubleEntryPoint.address);

    // Give CryptoVault some LGT (LegacyTokens)
    await legacyTokenContract
      .connect(targetDeployer)
      .mint(cryptoVault.address, ethers.utils.parseEther("100"));
  }

  const doubleEntryPoint: DoubleEntryPoint = await ethers.getContractAt(
    "DoubleEntryPoint",
    doubleEntryPointAddress
  );

  // get fortra contract
  const forta = await ethers.getContractAt(
    "Forta",
    await doubleEntryPoint.forta()
  );

  console.log(`forta address: ${forta.address}`);

  // deploy DoubleEntryPointAttacker
  const doubleEntryPointAttacker = await deploy("DoubleEntryPointAttacker", {
    from: atacker.address,
    args: [forta.address],
    log: true,
  });

  // setDetectionBot
  const tx = await forta
    .connect(atacker)
    .setDetectionBot(doubleEntryPointAttacker.address);

  await tx.wait(isLocalTest ? 1 : 5);

  log("All deployed! ");
};

deployment.tags = ["all", "double-entry-point"];

export default deployment;
