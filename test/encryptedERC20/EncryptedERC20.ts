import { expect } from "chai";
import { ethers } from "hardhat";

import { getInstance } from "../instance";
import type { Signers } from "../types";
import { deployEncryptedERC20Fixture } from "./EncryptedERC20.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("EncryptedERC20", function () {
    this.beforeEach(async function () {
      const contract = await deployEncryptedERC20Fixture();
      this.contractAddress = await contract.getAddress();
      this.erc20 = contract;
      const fhevmjs = await getInstance(this.contractAddress, ethers);
      this.fhevmjs = fhevmjs;
    });

    it("should mint the contract", async function () {
      const encryptedAmount = this.fhevmjs.encrypt32(1000);
      const transaction = await this.erc20.mint(encryptedAmount);
      await transaction.wait();

      // Call the method
      const token = this.fhevmjs.getTokenSignature(this.contractAddress) || { signature: "", publicKey: "" };
      const encryptedBalance = await this.erc20.balanceOf(token.publicKey, token.signature);

      // Decrypt the balance
      const balance = this.fhevmjs.decrypt(this.contractAddress, encryptedBalance);
      expect(balance).to.equal(1000);
    });
  });
});
