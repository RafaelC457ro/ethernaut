import { ethers, getNamedAccounts, network } from "hardhat";
import { Token } from "../typechain-types";

async function main() {
  const { deployer, targetDeployer } = await getNamedAccounts();
  const [_a, thirdParty] = await ethers.getSigners();
  const chainId = network.config.chainId;
  let token: Token;

  const isLocalTest = chainId === 31337;

  if (isLocalTest) {
    token = await ethers.getContract("Token", targetDeployer);
  } else {
    token = await ethers.getContractAt(
      "Token",
      "0xb0f7ba6AEE40b359d94eF754DBCF249e921163B7"
    );
  }

  const balance = await token.balanceOf(deployer);

  console.log(balance.toString());

  const tx = await token.connect(thirdParty).transfer(deployer, "0xff");
  await tx.wait(isLocalTest ? 1 : 4);

  const newBalance = await token.balanceOf(deployer);

  console.log(newBalance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
