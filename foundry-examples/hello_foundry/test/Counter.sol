
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
        uint256 initialNumber = counter.number();
        counter.increment();
        uint256 newNumber = counter.number();
        assert(newNumber == initialNumber + 1);
}

function testNumber () public {
    Counter counter = new Counter();
    uint256 expected = 10;
    counter.setNumber(expected);
    assert(counter.number() == expected);
    counter.increment();
    expected++;
    assert(counter.number() == expected);
}

function testSetNumber() public {
    Counter ctr = new Counter();
    
    uint256 expected = 42;
    
    ctr.setNumber(expected);
    
    uint256 actual = ctr.number();
    
    require(actual == expected, "Number not set correctly");
}
}
