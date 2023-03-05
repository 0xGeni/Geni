// SPDX-License-Identifier: UNLICENSED
// credits : Trail of Bits
pragma solidity ^0.7.0;

import "./token.sol";

/// @dev to run: $ echidna-test echidna_token.sol
contract TestToken is Token {
    address echidna_caller = msg.sender;

    constructor() public {
        balances[echidna_caller] = 10000;
        paused(); // Pause the contract
        owner = 0x0; // Lose ownership
    }

    // Test if value of the balance is properly decreasing
    function echidna_test_balance() public view returns (bool) {
        return balances[echidna_caller] <= 10000;
    }
    // Check if the contract cannot be unpaused
    function echidna_no_transfer() public view returns (bool) {}
}
