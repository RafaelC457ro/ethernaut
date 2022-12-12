import { network } from "hardhat";
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

  let forceAddress: string = "0x976DD4EF5C41E1a335Dd7315B4a471244748D0Ad"; // hardcoded from the challange

  if (isLocalTest) {
    const force = await deploy("Force", {
      from: targetDeployer,
      args: [],
      log: true,
    });

    forceAddress = force.address;
  }

  log("Force was deployed!");

  log("---------------------------------------------------------");

  await deploy("ForceAttacker", {
    from: deployer,
    args: [forceAddress],
  });

  log("ForceAttacker was deployed!");

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "force"];

export default deployment;
