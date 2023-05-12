const fse = require('fs-extra');
const { chatGPTResult } = require('../ai/chatgpt-smart-test');
const { funcTemplate, classTemplate } = require('../templates/foundryTemplate');

const generateGPTFuz = async (contractPath, inuputFile, filename, openaiApiKey) => {
   
    try {
        const contract = await readArtifact(inuputFile);

        if (contract) {
            return await generateGPTCode(filename, contract, `${contractPath}/${filename}.sol`, openaiApiKey);
        } else {
            console.error('Invalid contract file:', inuputFile);
        }
    } catch (error) {
       
        console.error(`Error processing file: ${inuputFile}`, error);
        return error;
    }
};
const generateUnitTest = async ( inuputFile, filename) => {
   
    try {
        const contract = await readArtifact(inuputFile);
         if (contract) {
            return await generateBasicTestCode(filename, contract);
        } else {
            console.error('Invalid contract file:', inuputFile);
        }
    } catch (error) {
       
        console.error(`Error processing file: ${inuputFile}`, error);
        return error;
    }
};

const readArtifact = async (inuputFile) => {
    try {
        return await fse.readJson(inuputFile, { throws: false });
    } catch (error) {
        console.error(`Error reading JSON file: ${inuputFile}`, error);
        throw error;
    }
};


const generateGPTCode = async (name, contract, path, openaiApiKey) => {

    let func = [];
    const promises = contract?.abi?.map(async (item) => {
        if (item.type == "function") {
            let param = item.inputs.map((data) => {
                return data.name == "" ? "Key" : data.name;
            });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const tempFunc = funcTemplate(funName);
            try {//smartContractPath, unitTest, openaiApiKey
                const data = await chatGPTResult(path, tempFunc, openaiApiKey);
                return data;
            } catch (error) {
                throw new Error("Error Getting Data");
            }
        }
    });
    const results = (await Promise.all(promises)).filter((item) => item !== undefined);
    func.push(...results);
    const file = classTemplate(name, "", func);
    return file

}

const generateBasicTestCode = async (name, contract) => {

    let func = contract?.abi?.map((item) => {
        if (item.type == "function") {
            let param = item.inputs.map((data) => {
                return data.name == "" ? "Key" : data.name;
            });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            return funcTemplate(funName);

        }
    }).filter((item) => item !== undefined);
    const file = classTemplate(name, "", func);
    return file

}
module.exports = {
    generateGPTFuz, generateUnitTest
}
