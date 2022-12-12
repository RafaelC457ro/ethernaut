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

  let telephoneAddress: string = "0xB4E98AE39D232cAE47F4f2374E004F0038261585"; // hardcoded from the challange

  if (isLocalTest) {
    const telephone = await deploy("Telephone", {
      from: targetDeployer, // hardcoded from localnode
      log: true,
    });

    telephoneAddress = telephone.address;
  }

  log("Telephone was deployed!");

  log("---------------------------------------------------------");

  await deploy("TelephoneAttacker", {
    from: deployer,
    args: [telephoneAddress!],
    log: true,
    waitConfirmations: isLocalTest ? 1 : 6,
  });

  log("TelephoneAttacekr was deployed!");

  log("---------------------------------------------------------");
};

deployment.tags = ["all", "telephone"];

export default deployment;
