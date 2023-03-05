
    // SPDX-License-Identifier: UNLICENSED
// credits : Trail of Bits
pragma solidity ^0.8.0;
// import you contract here 
import "../contracts/Lock.sol";


// you might need to Moc your token, do it here 

contract LockFuzzTest is Lock {

    // define you state vriables here 

  // define you errors here 

  constructor() public {
      // set up you testing here 
    }
   

function echidna_test_owner () public view returns (bool) {
    Lock lock = new Lock(block.timestamp + 500);
    
    // Check if owner is correctly set
    if (lock.owner() != address(this)) {
        return false;
    }
    
    // Check if withdrawal fails before unlock time
    try lock.withdraw() {
        return false;
    } catch Error(string memory) {
        // Expected error message.
    } catch (bytes memory) {
        return false;
    }
    
    // Check if withdrawal fails for non-owner before unlock time
    try lock.withdraw{from: address(1234)}() {
        return false;
    } catch Error(string memory) {
        // Expected error message.
    } catch (bytes memory) {
        return false;
    }
    
    // Check if withdrawal succeeds after unlock time
    uint unlockTime = lock.unlockTime();
    uint timePassed = 0;
    while (block.timestamp < unlockTime) {
        timePassed += 1;
    }
    try lock.withdraw() {
        // Expected successful withdrawal.
    } catch Error(string memory) {
        return false;
    } catch (bytes memory) {
        return false;
    }
    
    // Check if withdrawal fails for non-owner after unlock time
    try lock.withdraw{from: address(1234)}() {
        return false;
    } catch Error(string memory) {
        // Expected error message.
    } catch (bytes memory) {
        return false;
    }
    
    return true;
}

function echidna_test_unlockTime () public view returns (bool) {
    Lock lock = new Lock(block.timestamp + 100); // create new Lock with unlock time 100 seconds in future
    return lock.unlockTime == block.timestamp + 100; // check that unlock time is set correctly
}

function echidna_test_withdraw () public view returns (bool) {
   Lock lock = new Lock(block.timestamp + 100);
   lock.withdraw();
   return true;
}
}
