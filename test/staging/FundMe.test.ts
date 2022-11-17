import { ethers, deployments, getNamedAccounts, network } from "hardhat";
import { expect } from "chai";
import { FundMe } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe staging", () => {
      let fundMe: FundMe;
      let deployer: string;
      const sendValue = ethers.utils.parseEther("0.05");
      beforeEach(async () => {
        let { deployer: deployerAccount } = await getNamedAccounts();

        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        deployer = deployerAccount;
      });

      it("should allow people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();

        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        expect(endingBalance.toString()).to.equal("0");
      });
    });
