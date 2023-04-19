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

  let puzzleWalletAddress: string =
    "0x49FaB078A36482ce912A29ca3e825d52cC0BA299";

  if (isLocalTest) {
    // Deploy the puzzle wallet
    const PuzzleWallet = await deploy("PuzzleWallet", {
      from: targetDeployer.address,
      args: [],
      log: true,
    });

    // deploy proxy
    // data abi.encodeWithSelector(PuzzleWallet.init.selector, 100 ether);
    const i = new ethers.utils.Interface([
      "function init(uint256 _maxBalance)",
    ]);

    const data = i.encodeFunctionData("init", [
      ethers.utils.parseEther("100").toString(),
    ]);

    const PuzzleProxy = await deploy("PuzzleProxy", {
      from: targetDeployer.address,
      args: [targetDeployer.address, PuzzleWallet.address, data],
      log: true,
    });

    const puzzleWallet = await ethers.getContractAt(
      "PuzzleWallet",
      PuzzleProxy.address
    );

    console.log("Whitelisting target deployer...");
    // whitelist the target deployer
    const txWT = await puzzleWallet
      .connect(targetDeployer)
      .addToWhitelist(targetDeployer.address);
    await txWT.wait(1);

    console.log("Depositing 0.001 ether...");
    // deposit 0.001 ether
    const tx = await puzzleWallet
      .connect(targetDeployer)
      .deposit({ value: ethers.utils.parseEther("0.001") });
    await tx.wait(1);

    puzzleWalletAddress = PuzzleProxy.address;
  }

  // deploy PuzzleWalletAttacher
  await deploy("PuzzleWalletAttacher", {
    from: deployer.address,
    args: [puzzleWalletAddress],
    log: true,
  });

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "puzzle-wallet"];

export default deployment;
