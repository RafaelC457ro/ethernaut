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

  let shopAddress: string = "0xA193233961dF03ddb7E94194be294C839eEFa228";

  if (isLocalTest) {
    const shop = await deploy("Shop", {
      from: targetDeployer,
      args: [],
      log: true,
    });
    shopAddress = shop.address;
  }

  log("---------------------------------------------------------");

  await deploy("ShopAttacker", {
    from: deployer,
    args: [shopAddress],
    log: true,
  });

  log("ShopAttacker deployed!");
};

deployment.tags = ["all", "shop"];

export default deployment;
