const fs = require('fs');
const fse = require('fs-extra');
var path = require("path");


const geni = async (dir) => {
    console.log({ dir });
    const test_path = path.resolve(path.join(dir, "../", "../", "../", 'echidna_test'));
    const contract_path = path.resolve(path.join("../", "../", "../", "../", "../", "../", 'contracts'));

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
        console.log({ filename, dirName });
        if (filename == dirName) {

            console.log(` reading ${dir}/${file} ...`);

            const filePath = `${dir}/${file}`;
            const stats = fs.lstatSync(filePath);
            if (stats.isFile()) {
                const contract = await readArtifact(filePath);
                if (contract) {
                    const outputPath = `${outputDir}/echidna_${dirName}.sol`
                    const sourceCode = generateCode(filename, contract, `${contract_path}/${filename}.sol`).toString().replace(/},/g, '}');
                    console.log({ outputPath, sourceCode });
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
            const tempFunc = funcTemplate(item.name)

                func.push(tempFunc)

           



        }
    });
    return classTemplate(name, path,"",  func);

}

const WriteJsFile = async (path, content) => {
    console.log({ path, content });
    try {
        const obj = await fs.writeFile(path, content, data => console.log('Contract functions are written '))
       // console.log({ obj });
        return true;
    } catch (error) {
        return false;

    }


}

const classTemplate = (contractName, contractPath, prgma,  functions) => {

    return template = `
    // SPDX-License-Identifier: UNLICENSED
// credits : Trail of Bits
pragma solidity ^0.8.0;
// import you contract here 
import "..${contractPath}";


// you might need to Moc your token, do it here 

contract ${contractName}FuzzTest is ${contractName} {

    // define you state vriables here 

  // define you errors here 

  constructor() public {
      // set up you testing here 
    }
   ${functions}
}
`
}
const funcTemplate = (name) => {

    return template = ` function echidna_test_${name} ()  public view returns (bool) {
       // add your test logic here
         return true == false;
    }`
}


geni("./echidna-hh/artifacts/contracts/Lock.sol").then(s => {
     console.log({S:"SSSSSSSSS"});
 })
    module.exports = {
        geni
    }