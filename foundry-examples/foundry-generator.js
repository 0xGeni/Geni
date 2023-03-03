const fs = require('fs');
const fse = require('fs-extra');
var path = require("path");


const geni = async (dir) => {

    const test_path = path.resolve(path.join(dir,"../","../", 'test'));

    const dirFiles = await fse.readdir(dir)
    console.log(`generating solidity test in ${test_path} for contract artifact in  ${dirFiles}`);

    if (!await fse.pathExists(test_path)) {
        console.log(`creating  solidity test in  ${test_path}`);

        await fse.mkdirSync(test_path)
    }
    const dirName = path.basename(dir, path.extname(dir));
    const outputDir = test_path;
    dirFiles.map(async (file) => {
        const filename = path.basename(file, path.extname(file));
       
        if (filename == dirName) {

            console.log(` reading ${dir}/${file} ...`);

            const filePath = `${dir}/${file}`;
            const stats = fs.lstatSync(filePath);
            if (stats.isFile()) {
                const contract = await readArtifact(filePath);
                if (contract) {
                     const outputPath = `${outputDir}/${dirName}.sol`
                    const sourceCode = generateCode(filename,contract).toString().replace(/},/g, '}');

                    await WriteJsFile(outputPath, sourceCode);
 
                }
                else {
                    console.error(" invalid files");

                }
            }
}       
    })
}

const readArtifact = async (filePath) => {

    const obj = await fse.readJson(filePath, {
        throws: false
    })

    return obj;

}
const generateCode = (name,contract,  path) => {


    let func = [];
    // console.log({contract});
    console.log(contract.abi,"contract.abi");
    contract?.abi?.map((item) => {
        if (item.type == "function") {

            let param = item.inputs.map(data => {
                return data.name == "" ? "Key" : data.name;
            });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const tempFunc = funcTemplate(funName)

                func.push(tempFunc)

           



        }
    });
    return classTemplate(name,"",  func);

}

const WriteJsFile = async (path, content) => {
    console.log({ path, content });
    try {
        const obj = await fs.writeFile(path, content, data => console.log('Contract functions are written '))
        return true;
    } catch (error) {
        return false;

    }


}

const classTemplate = (contractName, prgma,  functions) => {

    return template = `
pragma solidity ^0.8.0;
// import you contract here 
import "../src/${contractName}.sol";

// this is so helpful but make sure to install forge-test in your cargo.toml
import "forge-std/Test.sol";

// you might need to Moc your token, do it here 

contract TestAirdrop is Test {
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
        assert(1 >= 2);
    }`
}


// geni("./out/Airdrop.sol").then(s => {
//      console.log({S:"SSSSSSSSS"});
//  })
    module.exports = {
        geni
    }