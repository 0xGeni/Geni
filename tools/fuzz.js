const fse = require('fs-extra');
const { chatGPTResult } = require('../ai/chatgpt-smart-test');
const { funcTemplate: foundryFuncTemplate, classTemplate: foundryClassTemplate } = require('../templates/foundryTemplate');
const { funcTemplate: echidnaFuncTemplate, classTemplate: echidnaClassTemplate } = require('../templates/echidnaTemplate');
const generateGPTFuz = async(inuputFile, filename, contractPath, openaiApiKey, tool) => {
     try {
        const contract = await readArtifact(inuputFile);

        if (contract) {
            return await generateGPTCode(filename, contract, `${contractPath}/${filename}.sol`, openaiApiKey,tool);
        } else {
            console.error('Invalid contract file:', inuputFile);
        }
    } catch (error) {
       
        console.error(`Error processing file: ${inuputFile}`, error);
        return error;
    }
};
const generateNonAIFuz = async ( inuputFile, filename, tool) => {
   
    try {
        const contract = await readArtifact(inuputFile);
         if (contract) {
            return generateFuzzCode(filename, contract,  tool);
        } else {
            console.error('Invalid contract file:', inuputFile);
        }
    } catch (error) {
       
        console.error(`Error processing file: ${inuputFile}`, error);
        return error;
    }
};
const generateUnitTest = async ( inuputFile, filename, tool) => {
   
    try {
        const contract = await readArtifact(inuputFile);
         if (contract) {
             return await generateBasicTestCode(filename, contract, tool);
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


const generateGPTCode = async (name, contract, path, openaiApiKey, tool) => {
    // console.log("24444");
    let funcTemplate;
    let classTemplate;
    if (tool == "Echidna") {
        funcTemplate = echidnaFuncTemplate;
        classTemplate = echidnaClassTemplate;

    } else if (tool == "Foundry") {
        funcTemplate = foundryFuncTemplate;
        classTemplate = foundryClassTemplate;
    } else {
        throw new Error("Invalid tool");
    }
    let func = [];
    const promises = contract?.abi?.map(async (item) => {
        if (item.type == "function") {
            // let param = item.inputs.map((data) => {
            //     return data.name == "" ? "Key" : data.name;
            // });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const tempFunc = funcTemplate(funName);
            try {//smartContractPath, unitTest, openaiApiKey
                const data = await chatGPTResult(path, tempFunc, openaiApiKey);
              console.log({data});
                return data;
            } catch (error) {
                throw new Error("Error Getting Data");
            }
        }
    });
    const results = (await Promise.all(promises)).filter((item) => item !== undefined);
    func.push(...results);
   
    const file = classTemplate(name,  func);
    return file

}
const generateFuzzCode =  (name, artifacts,   tool) => {
    let funcTemplate;
    let classTemplate;
    if (tool == "Echidna") {
        funcTemplate = echidnaFuncTemplate;
        classTemplate = echidnaClassTemplate;

    } else if (tool == "Foundry") {
        funcTemplate = foundryFuncTemplate;
        classTemplate = foundryClassTemplate;
    } else {
        throw new Error("Invalid tool");
    }
    let func = [];
    const data = artifacts?.abi?.map((item) => {
        if (item.type == "function") {
            // let param = item.inputs.map((data) => {
            //     return data.name == "" ? "Key" : data.name;
            // });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            return funcTemplate(funName);
        
        }
    });
    // console.log({data},"check data for functions");
    const results = data.filter((item) => item !== undefined);
    func.push(...results);
   
    const file = classTemplate(name, func);
    return file

}

const generateBasicTestCode = async (name, contract, tool) => {
    let funcTemplate;
    let classTemplate;
    if (tool == "Echidna") { 
        funcTemplate = echidnaFuncTemplate;
        classTemplate = echidnaClassTemplate;

    } else if(tool == "Foundry") {
        funcTemplate = foundryFuncTemplate;
        classTemplate = foundryClassTemplate;
    } else {
        throw new Error("Invalid tool");
    }
    let func = contract?.abi?.map((item) => {
        if (item.type == "function") {
            // let param = item.inputs.map((data) => {
            //     return data.name == "" ? "Key" : data.name;
            // });
            const funName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
           
            const res = funcTemplate(funName);
             
            return res;

        }
    }).filter((item) => item !== undefined);
    const file = classTemplate(name, func);
    return file

}
module.exports = {
    generateGPTFuz, generateUnitTest, generateNonAIFuz
}
