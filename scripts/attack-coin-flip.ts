import { ethers, getNamedAccounts } from "hardhat";
import { CoinFlipAttacker } from "../typechain-types/CoinFlipAttacker.sol";

async function main() {
  const { deployer } = await getNamedAccounts();
  const coinFlipAttacker: CoinFlipAttacker = await ethers.getContract(
    "CoinFlipAttacker",
    deployer
  );

  const tx = await coinFlipAttacker.run();
  await tx.wait(2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
