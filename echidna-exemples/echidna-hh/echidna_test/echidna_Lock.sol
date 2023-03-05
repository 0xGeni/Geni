
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
   

function echidna_test_owner() public view returns (bool) {
    Lock lock = new Lock(block.timestamp + 10);
    require(lock.owner() == msg.sender, "Owner should be the contract deployer");
    return true;
}

function echidna_test_unlockTime () public view returns (bool) {
       // Check if unlockTime is set correctly during contract initialization
       Lock l = new Lock(block.timestamp + 1000);
       if (l.unlockTime() != block.timestamp + 1000) {
           return false;
       }

       // Check if owner can withdraw after unlockTime has passed
       l = new Lock(block.timestamp + 1);
       bool success = true;
       try l.withdraw() {
           success = false;
       } catch {}

       if (success) {
           return false;
       }

       // Check if non-owner cannot withdraw after unlockTime has passed
       l = new Lock(block.timestamp + 1);
       success = true;
       try l.withdraw{from:accounts[1]}() {
           success = false;
       } catch {}

       if (success) {
           return false;
       }

       return true;
}

function echidna_test_withdraw () public view returns (bool) {
    Lock testLock = new Lock(block.timestamp + 86400);
    bool success = true;
    
    // Test that withdrawal fails before unlock time
    try testLock.withdraw() {
        success = false;
    } catch {}
    
    // Test that withdrawal fails if not called by owner
    try testLock.withdraw{value: 1 wei, gas: 5000}() {
        success = false;
    } catch {}
    
    // Test that withdrawal succeeds after unlock time and caller is owner
    try testLock.withdraw{value: 1 wei, gas: 5000, from: address(this)}() {
        // If we reach this point, withdrawal succeeded
    } catch {
        success = false;
    }
    
    return success;
}
}
