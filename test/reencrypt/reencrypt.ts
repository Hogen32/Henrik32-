import { expect } from "chai";
import { ethers } from "hardhat";

import { createInstance } from "../instance";
import {
  reencryptEaddress,
  reencryptEbool,
  reencryptEbytes64,
  reencryptEbytes128,
  reencryptEbytes256,
  reencryptEuint4,
  reencryptEuint8,
  reencryptEuint16,
  reencryptEuint32,
  reencryptEuint64,
  reencryptEuint128,
  reencryptEuint256,
} from "../reencrypt";
import { getSigners, initSigners } from "../signers";

describe("Reencryption", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
    this.fhevm = await createInstance();
    const contractFactory = await ethers.getContractFactory("Reencrypt");

    this.contract = await contractFactory.connect(this.signers.alice).deploy();
    await this.contract.waitForDeployment();
    this.contractAddress = await this.contract.getAddress();
  });

  it("test reencrypt ebool", async function () {
    const handle = await this.contract.xBool();
    const decryptedValue = await reencryptEbool(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(true);

    // on the other hand, Bob should be unable to read Alice's balance
    await expect(reencryptEbool(this.signers.bob, this.fhevm, handle, this.contractAddress)).to.be.rejectedWith(
      "User is not authorized to reencrypt this handle!",
    );
  });

  it("test reencrypt euint4", async function () {
    const handle = await this.contract.xUint4();
    const decryptedValue = await reencryptEuint4(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(4);
  });

  it("test reencrypt euint8", async function () {
    const handle = await this.contract.xUint8();
    const decryptedValue = await reencryptEuint8(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(42);
  });

  it("test reencrypt euint16", async function () {
    const handle = await this.contract.xUint16();
    const decryptedValue = await reencryptEuint16(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(16);
  });

  it("test reencrypt euint32", async function () {
    const handle = await this.contract.xUint32();
    const decryptedValue = await reencryptEuint32(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(32);
  });

  it("test reencrypt euint64", async function () {
    const handle = await this.contract.xUint64();
    const decryptedValue = await reencryptEuint64(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(18446744073709551600n);
  });

  it("test reencrypt euint128", async function () {
    const handle = await this.contract.xUint128();
    const decryptedValue = await reencryptEuint128(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(145275933516363203950142179850024740765n);
  });

  it("test reencrypt eaddress", async function () {
    const handle = await this.contract.xAddress();
    const decryptedValue = await reencryptEaddress(this.signers.alice, this.fhevm, handle, this.contractAddress);
    expect(decryptedValue).to.equal(BigInt("0x8ba1f109551bD432803012645Ac136ddd64DBA72"));
  });

  it("test reencrypt euint256", async function () {
    const handle = await this.contract.xUint256();
    const decryptedValue = await reencryptEuint256(this.signers.alice, this.fhevm, handle, this.contractAddress);

    expect(decryptedValue).to.equal(74285495974541385002137713624115238327312291047062397922780925695323480915729n);
  });

  it("test reencrypt ebytes64", async function () {
    const handle = await this.contract.yBytes64();
    const decryptedValue = await reencryptEbytes64(this.signers.alice, this.fhevm, handle, this.contractAddress);

    expect(decryptedValue).to.equal(
      BigInt(
        "0x19d179e0cc7e816dc944582ed4f5652f5951900098fc2e0a15a7ea4dc8cfa4e3b6c54beea5ee95e56b728762f659347ce1d4aa1b05fcc5",
      ),
    );
  });

  it("test reencrypt ebytes128", async function () {
    const handle = await this.contract.yBytes128();
    const decryptedValue = await reencryptEbytes128(this.signers.alice, this.fhevm, handle, this.contractAddress);

    expect(decryptedValue).to.equal(
      BigInt(
        "0x13e7819123de6e2870c7e83bb764508e22d7c3ab8a5aee6bdfb26355ef0d3f1977d651b83bf5f78634fa360aa14debdc3daa6a587b5c2fb1710ab4d6677e62a8577f2d9fecc190ad8b11c9f0a5ec3138b27da1f055437af8c90a9495dad230",
      ),
    );
  });

  it("test reencrypt ebytes256", async function () {
    const handle = await this.contract.yBytes256();
    const decryptedValue = await reencryptEbytes256(this.signers.alice, this.fhevm, handle, this.contractAddress);

    expect(decryptedValue).to.equal(
      BigInt(
        "0xd179e0cc7e816dc944582ed4f5652f5951900098fc2e0a15a7ea4dc8cfa4e3b6c54beea5ee95e56b728762f659347ce1d4aa1b05fcc513e7819123de6e2870c7e83bb764508e22d7c3ab8a5aee6bdfb26355ef0d3f1977d651b83bf5f78634fa360aa14debdc3daa6a587b5c2fb1710ab4d6677e62a8577f2d9fecc190ad8b11c9f0a5ec3138b27da1f055437af8c90a9495dad230",
      ),
    );
  });
});
