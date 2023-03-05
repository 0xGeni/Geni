
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

   

function testIncrement() public {
   Counter counter = new Counter();
   uint256 initialNumber = 0;
   uint256 expectedNumber = 1;
   uint256 actualNumber;

   counter.setNumber(initialNumber);
   counter.increment();
   actualNumber = counter.number();

   Assert.equal(actualNumber, expectedNumber, "Increment failed");
}

function testNumber() public {
    Counter counter = new Counter();
    uint256 expected = 10;

    counter.setNumber(expected);

    assert(counter.number() == expected);
}

function testSetNumber () public {
    Counter counter = new Counter();
    uint256 expectedNumber = 42;
    counter.setNumber(expectedNumber);
    uint256 actualNumber = counter.number();
    Assert.equal(actualNumber, expectedNumber, "Number should be set correctly");
}
}
