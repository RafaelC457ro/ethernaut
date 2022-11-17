import { ethers, deployments, getNamedAccounts, network } from "hardhat";
import { expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fundme", () => {
      let fundMe: FundMe;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: string;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        let { deployer: deployerAccount } = await getNamedAccounts();

        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
        deployer = deployerAccount;
      });

      describe("constructor", async () => {
        it("should set the aggregator addresses correctly", async () => {
          const response = await fundMe.s_priceFeed();
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

          const response = await fundMe.getAddressToAmountFunded(deployer);
          expect(response.toString()).to.equal(sendValue.toString());
        });

        it("should adds funder to array of funders", async () => {
          await fundMe.fund({
            value: sendValue,
          });

          const funder = await fundMe.getFunder(0);
          expect(funder).to.equal(deployer);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({
            value: sendValue,
          });
        });

        it("should withdraw ETH from a single founder", async () => {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          const gasCost = transactionReceipt.gasUsed.mul(
            transactionReceipt.effectiveGasPrice
          );
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          expect(endingFundMeBalance).to.equal(0);
          expect(endingDeployerBalance.toString()).to.equal(
            startingDeployerBalance.add(startingFundMeBalance).sub(gasCost)
          );
        });

        it("it should allow us to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();

          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);

            await fundMeConnectedContract.fund({
              value: sendValue,
            });
          }

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          const gasCost = transactionReceipt.gasUsed.mul(
            transactionReceipt.effectiveGasPrice
          );
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          expect(endingFundMeBalance).to.equal(0);
          expect(endingDeployerBalance.toString()).to.equal(
            startingDeployerBalance.add(startingFundMeBalance).sub(gasCost)
          );

          expect(fundMe.getFunder(0)).to.be.reverted;

          for (let i = 1; i < 6; i++) {
            expect(
              await fundMe.getAddressToAmountFunded(accounts[i].address)
            ).to.equal(0);
          }
        });

        it("should only allow the owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];

          const attackerConnectedContract = fundMe.connect(attacker);
          expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });

        it("it should allow us to cheaper withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();

          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);

            await fundMeConnectedContract.fund({
              value: sendValue,
            });
          }

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          const gasCost = transactionReceipt.gasUsed.mul(
            transactionReceipt.effectiveGasPrice
          );
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          expect(endingFundMeBalance).to.equal(0);
          expect(endingDeployerBalance.toString()).to.equal(
            startingDeployerBalance.add(startingFundMeBalance).sub(gasCost)
          );

          expect(fundMe.getFunder(0)).to.be.reverted;

          for (let i = 1; i < 6; i++) {
            expect(
              await fundMe.getAddressToAmountFunded(accounts[i].address)
            ).to.equal(0);
          }
        });
      });
    });
