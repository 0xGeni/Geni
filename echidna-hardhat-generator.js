const fs = require('fs');
const fse = require('fs-extra');
var path = require("path");
const {generateUnitTest}= require('./smart-test.js')
const {WriteJsFile}= require('./writer.js')
const { funcTemplate,classTemplate }= require('./echidnaTemplate')


const geni = async (dir) => {

    const basePath = path.resolve(path.join(dir, "../", "../"));
    const outputDir = path.resolve(path.join(basePath, 'test'));
    const contract_path = path.resolve(path.join(basePath, 'contracts'));

    const contractPath = path.relative(process.cwd(), contract_path);

    console.log({ outputDir, basePath, contract_path, contractPath });
    const dirFiles = await fse.readdir(dir)
    console.log(`generating solidity test in ${outputDir} for contract artifact in  ${dirFiles}`);

    if (!await fse.pathExists(outputDir)) {
        console.log(`creating  solidity test in  ${outputDir}`);

        await fse.mkdirSync(outputDir)
    }
    const dirName = path.basename(dir, path.extname(dir));
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
                     generateCode(filename, contract, `${contractPath}/${filename}.sol`).then(async(data) => {
                             console.log({ data });
                        await WriteJsFile(outputPath, data.toString().replace(/},/g, '}'));
                    })
                       
               
 
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
const generateCode = async (name,contract,  path) => {

    let func = [];
    // console.log({contract});
    // console.log(contract.abi,"contract.abi");
    const promises = contract?.abi?.map(async (item) => {
        if (item.type == "function") {
            let param = item.inputs.map((data) => {
                return data.name == "" ? "Key" : data.name;
            });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const tempFunc = funcTemplate(funName);
            try {
                const data = await generateUnitTest(path, tempFunc);
                return data;
            } catch (error) {
                throw new Error("Error Getting Data");
            }
        }
    });
    const results = await Promise.all(promises);
    const filteredResults = results.filter((item) => item !== undefined);
    func.push(...filteredResults);
    const file = classTemplate(name, "", func);
    console.log({file});
    return file

}




geni("echidna-exemples/echidna-hh/artifacts/contracts/Lock.sol").then(s => {
     console.log({S:"SSSSSSSSS"});
 })
    module.exports = {
         geni
    }