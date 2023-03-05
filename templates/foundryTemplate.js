const classTemplate = (contractName, prgma, functions) => {
  console.log({ contractName, prgma, functions });
    return template = `
pragma solidity ^0.8.0;
// import you contract here 
import "../src/${contractName}.sol";

// this is so helpful but make sure to install forge-test in your cargo.toml
import "forge-std/Test.sol";

// you might need to Moc your token, do it here 

contract Test${contractName} is Test {
    // define you state vriables here 

  // define you errors here 
    function setUp() public {
      // set up you testing here 
    }

   ${functions}
}
`
}
const funcTemplate = (name) => {

    return template = ` function test${name} () public {
       // add your test logic here 
       
    }`
}
module.exports = {
    funcTemplate,classTemplate
}