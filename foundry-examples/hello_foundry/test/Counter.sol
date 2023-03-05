
pragma solidity ^0.8.0;
// import you contract here 
import "../src/Counter.sol";

// this is so helpful but make sure to install forge-test in your cargo.toml
import "forge-std/Test.sol";

// you might need to Moc your token, do it here 

contract TestCounter is Test {
    // define you state vriables here 

  // define you errors here 
    function setUp() public {
      // set up you testing here 
    }

   

function testIncrement () public {
   Counter counter = new Counter();
   uint256 initialNumber = counter.number();
   counter.increment();
   uint256 finalNumber = counter.number();
   Assert.equal(finalNumber, initialNumber + 1, "Number should have incremented by 1");
}

function testNumber() public {
    Counter counter = new Counter();
    uint256 expectedNumber = 10;

    counter.setNumber(expectedNumber);
    uint256 actualNumber = counter.number();

    assert(actualNumber == expectedNumber);

    counter.increment();
    expectedNumber++;

    actualNumber = counter.number();

    assert(actualNumber == expectedNumber);
}

function testSetNumber () public {
   Counter instance = new Counter();
   instance.setNumber(5);
   uint expectedNumber = 5;
   assert(instance.number() == expectedNumber);
}
}
