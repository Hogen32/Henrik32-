import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import type { FhevmInstance } from "fhevmjs";

import type { EncryptedERC20 } from "../types/contracts/EncryptedERC20";

declare module "mocha" {
  export interface Context {
    signers: Signers;
    contractAddress: string;
    fhevmjs: FhevmInstance;
    erc20: EncryptedERC20;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
