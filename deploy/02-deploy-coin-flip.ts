import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployment: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  await deploy("CoinFlipAttacker", {
    from: deployer,
    args: ["0x847ef7006e390e406e7514fCBE409ddfD8f76698"], // hardcoded changes everytime
    log: true,
    waitConfirmations: isLocalTest ? 1 : 6,
  });

  log("CoinFlip Attacker deployed!");

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "coin-flip"];

export default deployment;
