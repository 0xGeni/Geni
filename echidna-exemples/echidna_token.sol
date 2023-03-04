// SPDX-License-Identifier: UNLICENSED
// credits : Trail of Bits
pragma solidity ^0.7.0;

import "./token.sol";

/// @dev to run: $ echidna-test echidna_token.sol
contract TestToken is Token {
    address echidna_caller = msg.sender;

    constructor() public {
        balances[echidna_caller] = 10000;
        paused(); // pause the contract
        owner = 0x0; // lose ownership
    }

    function echidna_test_balance() public view returns (bool) {
        return balances[echidna_caller] <= 10000;
    }

    function echidna_no_transfer() public view returns (bool) {}
}
