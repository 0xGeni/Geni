
    // SPDX-License-Identifier: UNLICENSED
// credits : Trail of Bits
pragma solidity ^0.8.0;
// import you contract here 
import "..echidna-exemples/echidna-hh/contracts/Lock.sol";


// you might need to Moc your token, do it here 

contract LockFuzzTest is Lock {

    // define you state vriables here 

  // define you errors here 

  constructor() public {
      // set up you testing here 
    }
   

function echidna_test_owner () public view returns (bool) {
       // constructor parameters
        uint unlockTime = block.timestamp + 100;

       Lock lck = new Lock(unlockTime);

       // check owner
        return msg.sender == address(lck.owner());
}

function echidna_test_unlockTime () public view returns (bool) {
    uint unlockTime = block.timestamp + 60;
    Lock lock = new Lock(unlockTime);
    return lock.unlockTime() == unlockTime;
}

function echidna_test_withdraw() public view returns (bool) {
        Lock lock = new Lock(block.timestamp + 86400);
        lock.withdraw();
        // Assert that the contract balance is zero after withdrawal
        assert(lock.balance == 0);
        return true;
    }
}
