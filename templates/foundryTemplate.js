const classTemplate = (contractName, functions, pragma = "^0.8.0", contractPath ="../src/") => {
    return template = `
pragma solidity ${pragma};
// import you contract here 
import "${contractPath}${contractName}.sol";

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