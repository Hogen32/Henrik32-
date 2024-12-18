// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";
import "fhevm/oracle/OracleCaller.sol";
import "fhevm/abstracts/Reencrypt.sol";

contract AsyncERC20 is OracleCaller, Reencrypt {
    constructor() {
        _mint(1000000, msg.sender);
    }

    event Transfer(address indexed from, address indexed to);
    event Mint(address indexed to, uint64 amount);

    uint64 public totalSupply;
    uint8 public constant decimals = 6;

    mapping(address => euint64) internal balances;
    mapping(address => uint256) public maxTimestampPendingRequest;

    function _mint(uint64 amount, address to) internal {
        balances[to] = TFHE.add(balances[to], amount); // overflow impossible because of next line
        totalSupply += amount;
        emit Mint(to, amount);
    }
    function requestTransfer(address to, bytes calldata encryptedAmount) public {
        transfer(to, TFHE.asEuint64(encryptedAmount));
    }

    function transfer(address to, euint64 amount) public {
        require(maxTimestampPendingRequest[msg.sender] == 0, "sender already has a pending request");
        ebool canTransfer = TFHE.le(amount, balances[msg.sender]);
        _requestTransfer(msg.sender, to, amount, canTransfer);
    }

    function balanceOf(
        address wallet,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        require(wallet == msg.sender, "User cannot reencrypt a non-owned wallet balance");
        return TFHE.reencrypt(balances[wallet], publicKey, 0);
    }

    function _requestTransfer(address from, address to, euint64 amount, ebool isTransferable) internal {
        ebool[] memory cts = new ebool[](1);
        cts[0] = isTransferable;
        uint256 maxTimestamp = block.timestamp + 100;
        uint256 requestID = Oracle.requestDecryption(cts, this.fulfillTransfer.selector, 0, maxTimestamp);
        addParamsEUint64(requestID, amount);
        addParamsAddress(requestID, from);
        addParamsAddress(requestID, to);
        maxTimestampPendingRequest[msg.sender] = maxTimestamp;
    }

    function fulfillTransfer(uint256 requestID, bool isTransferableDecrypted) public onlyOracle {
        address[] memory users = getParamsAddress(requestID);
        address from = users[0];
        if (isTransferableDecrypted) {
            address to = users[1];
            euint64 amountTransferred = getParamsEUint64(requestID)[0];
            balances[to] = balances[to] + amountTransferred;
            balances[from] = balances[from] - amountTransferred;
            emit Transfer(from, to);
        }
        maxTimestampPendingRequest[from] = 0;
    }

    function cancelTransfer() public {
        // could be called by the sender if the oracle did not fill his request after maxTimestamp
        require(maxTimestampPendingRequest[msg.sender] > 0, "sender does not have a pending request");
        require(
            maxTimestampPendingRequest[msg.sender] < block.timestamp,
            "sender's pending request has not expired yet"
        );
        maxTimestampPendingRequest[msg.sender] = 0;
    }
}
