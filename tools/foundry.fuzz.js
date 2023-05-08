const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { generateUnitTest: chatGPTResult } = require('../ai/chatgpt-smart-test');
const { WriteJsFile } = require('../writer.js');
const { funcTemplate, classTemplate } = require('../templates/foundryTemplate');

const generate = async (outputDir, inuputFile) => {
   
    try {
        const contract = await readArtifact(inuputFile);

        if (contract) {
            const outputPath = `${outputDir}/${dirName}.sol`;
            const data = await generateCode(filename, contract, `${contractPath}/${filename}.sol`);
            await WriteJsFile(outputDir, data.toString().replace(/},/g, '}'));
            console.log(`File written: ${outputPath}`);
        } else {
            console.error('Invalid contract file:', filePath);
        }
    } catch (error) {
        console.error(`Error processing file: ${filePath}`, error);
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
    const promises = contract?.abi?.map(async (item) => {
        if (item.type == "function") {
            let param = item.inputs.map((data) => {
                return data.name == "" ? "Key" : data.name;
            });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const tempFunc = funcTemplate(funName);
            try {
                const data = await chatGPTResult(path, tempFunc);
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
    return file

}

module.exports = {
    generate
}