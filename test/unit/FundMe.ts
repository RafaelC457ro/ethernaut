import { ethers, deployments, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

describe("SimpleStorage", () => {
  let fundMe: FundMe;
  let mockV3Aggregator: MockV3Aggregator;
  let deployer: string;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async () => {
    let { deployer: deployerAccount } = await getNamedAccounts();

    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    deployer = deployerAccount;
  });

  describe("constructor", async () => {
    it("should set the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      expect(response).to.equal(mockV3Aggregator.address);
    });
  });

  describe("fund", () => {
    it("should fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("should update the amount funded data structure", async () => {
      await fundMe.fund({
        value: sendValue,
      });

      const response = await fundMe.addressToAmountFunded(deployer);
      expect(response.toString()).to.equal(sendValue.toString());
    });
  });
});
