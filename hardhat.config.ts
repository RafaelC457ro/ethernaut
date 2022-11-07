import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 5,
      gasPrice: 1083000,
    },
  },
  solidity: "0.8.17",
};

export default config;
