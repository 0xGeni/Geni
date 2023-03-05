# General overview

An Echidna specification file needs to contain the original solidity file, and add to it at the end a Test<contract-name> contract which implements echidna testing functions.

# Exemples of Echidna testing functions from Trail of Bits

Database of echidna specifications inspired from : https://github.com/crytic/echidna-streaming-series/

## Token.sol part 1: Test if the value of the balance is properly decreasing. Here we test with an initial value of 10000 for the exemple
### Tags : BALANCE,TRANSFER FUNCTION
import "token.sol";

contract TestToken is Token {
    address echidna_caller = msg.sender;

    constructor() public {
        balances[echidna_caller] = 10000;
    }

    function echidna_test_balance() public view returns (bool) {
        return balances[echidna_caller] <= 10000;
    }

## Token.sol part 2: Check if the contract cannot be unpaused
### Tags : PAUSABLE

import "token.sol";

contract TestToken is Token {
    constructor() public {
        paused();
        owner = address(0x0); // lose ownership
    }

    function echidna_test_pausable() public view returns (bool) {
        return is_paused == true;
    }
}

# Custom exemples of Echidna testing functions

## Voting.sol: Test if all votes are counted properly
### Tags: VOTING, COUNTING

import "voting.sol";

contract TestVoting is Voting {
    address echidna_caller = msg.sender;

    constructor() public {
        add_voter(echidna_caller);
        add_candidate("Alice");
        add_candidate("Bob");
        start_voting();
        cast_vote(0);
        cast_vote(0);
        cast_vote(1);
    }   

    function echidna_test_vote_count() public view   returns (bool) {
        return vote_count(0) == 2 && vote_count(1) == 1;
    }
}

## Escrow.sol: Test if the contract refunds the sender if the deadline has passed
### Tags: ESCROW, REFUND

import "escrow.sol"

contract TestEscrow is Escrow {
    address echidna_caller = msg.sender;

    constructor() public {
        seller = address(0x1);
        buyer = echidna_caller;
        amount = 100;
        deadline = block.timestamp + 1; // deadline is 1 second from now
    }

    function echidna_test_refund() public {
    require(block.timestamp >= deadline);
        refund();
        assert(balanceOf(echidna_caller) == 100);
    }
}

## Auction.sol: Test if the contract correctly handles bids and winner selection
### Tags: AUCTION, BIDDING, WINNER

import "auction.sol"

contract TestAuction is Auction {
    address echidna_caller = msg.sender;


    constructor() public {
        owner = echidna_caller;
        item = "Painting";
        start_bid = 50;
        start_auction();
        place_bid(60);
        place_bid(70);
        place_bid(80);
        end_auction();
    }

    function echidna_test_winner() public view returns (bool) {
        return highest_bidder() == echidna_caller && winning_bid() == 80;
    }
}
