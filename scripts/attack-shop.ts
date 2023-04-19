import { ethers, network } from "hardhat";
import { Denial, Shop, ShopAttacker } from "../typechain-types";

async function main() {
  let shop: Shop;
  const [deployer] = await ethers.getSigners();

  const chainId = network.config.chainId;

  const isLocalTest = chainId === 31337;

  const shopAttacker: ShopAttacker = await ethers.getContract("ShopAttacker");

  if (isLocalTest) {
    shop = await ethers.getContract("Shop");
  } else {
    shop = await ethers.getContractAt(
      "Shop",
      "0xA193233961dF03ddb7E94194be294C839eEFa228"
    );
  }

  async function check() {
    const isSold = await shop.isSold();
    const price = await shop.price();
    console.log(`isSold: ${isSold}`);
    console.log(`price: ${price.toString()}`);
  }

  console.log("Before the attack:");

  await check();

  const tx = await shopAttacker.attack();

  await tx.wait(isLocalTest ? 1 : 5);

  console.log("-------------------------------------------------------");
  console.log("After the attack:");

  await check();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
