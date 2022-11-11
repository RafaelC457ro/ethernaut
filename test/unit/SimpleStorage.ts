import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("SimpleStorage", () => {
  async function deploy() {
    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );

    const simpleStorage = await SimpleStorageFactory.deploy();
    return { simpleStorage };
  }

  it("should start with a favorite number of 0", async () => {
    const { simpleStorage } = await loadFixture(deploy);

    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    expect(currentValue).to.equal(expectedValue);
  });

  it("should update when we call store", async () => {
    const { simpleStorage } = await loadFixture(deploy);
    const expectedValue = "7";
    const transactionReponse = await simpleStorage.store(expectedValue);
    await transactionReponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(expectedValue);
  });

  it("should add a person and favorite number", async () => {
    const { simpleStorage } = await loadFixture(deploy);
    const expectedValue = "3";
    // added name and favorite number
    const transation = await simpleStorage.addPerson("vitalik", "3");
    await transation.wait(1);
    const [currentVitalikFavoriteNumber, name] = await simpleStorage.people(0);

    expect(currentVitalikFavoriteNumber).to.equal(expectedValue);
    expect(name).to.equal("vitalik");
  });
});
