const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { generateUnitTest } = require('./smart-test.js');
const { WriteJsFile } = require('./writer.js');
const { funcTemplate, classTemplate } = require('./templates/foundryTemplate');

const geni = async (dir) => {
    const basePath = path.resolve(path.join(dir, '../', '../'));
    const outputDir = path.resolve(path.join(basePath, 'test'));
    const contractPath = path.relative(process.cwd(), path.resolve(path.join(basePath, 'src')));
    // console.log({ outputDir, basePath, contractPath });

    try {
        await fse.ensureDir(outputDir);
    } catch (error) {
        console.error(`Error creating directory: ${outputDir}`, error);
        throw error;
    }

    const dirName = path.basename(dir, path.extname(dir));
    const dirFiles = await fse.readdir(dir);
    console.log(`Generating solidity test in ${outputDir} for contract artifact in ${dir}`);

    for (const file of dirFiles) {
        const filename = path.basename(file, path.extname(file));

        if (filename === dirName) {
            console.log(`Reading ${dir}/${file}...`);

            const filePath = `${dir}/${file}`;
            const stats = fs.lstatSync(filePath);

            if (stats.isFile()) {
                try {
                    const contract = await readArtifact(filePath);

                    if (contract) {
                        const outputPath = `${outputDir}/${dirName}.sol`;
                        const data = await generateCode(filename, contract, `${contractPath}/${filename}.sol`);
                        await WriteJsFile(outputPath, data.toString().replace(/},/g, '}'));
                        console.log(`File written: ${outputPath}`);
                    } else {
                        console.error('Invalid contract file:', filePath);
                    }
                } catch (error) {
                    console.error(`Error processing file: ${filePath}`, error);
                }
            }
        }
    }
};

const readArtifact = async (filePath) => {
    try {
        const obj = await fse.readJson(filePath, { throws: false });
        return obj;
    } catch (error) {
        console.error(`Error reading JSON file: ${filePath}`, error);
        throw error;
    }
};


const generateCode = async (name, contract, path) => {

    let func = [];
    // console.log({contract});
    console.log(path,"contract.abi");
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




// geni("foundry-examples/hello_foundry/out/Counter.sol/").then(s => {
//      console.log({S:"SSSSSSSSS"});
//  })
module.exports = {
    geni
}