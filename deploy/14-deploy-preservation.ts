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

  let preservationAddress = "0x4847E59948BDa068d2B03a684D40f1dE100b3B11";

  if (isLocalTest) {
    const lib1 = await deploy("LibraryContract", {
      from: targetDeployer,
      args: [],
      log: true,
    });

    const lib2 = await deploy("LibraryContract", {
      from: targetDeployer,
      args: [],
      log: true,
      skipIfAlreadyDeployed: false,
    });

    const preservation = await deploy("Preservation", {
      from: targetDeployer,
      args: [lib1.address, lib2.address],
      log: true,
    });
    preservationAddress = preservation.address;
  }

  log("---------------------------------------------------------");

  await deploy("PreservationAttacker", {
    from: deployer,
    args: [preservationAddress],
    log: true,
  });

  log("PreservationAttacker deployed!");
};

deployment.tags = ["all", "preservation"];

export default deployment;
