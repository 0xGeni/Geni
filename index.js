#!/usr/bin/env node
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const figlet = require("figlet");
const { WriteJsFile } = require('./writer.js');
const { generateGPTFuz, generateUnitTest } = require('./tools/foundry.fuzz.js');
const { askQuestions, askQuestionsForAI, askQuestionsForChatGPT } = require("./inquirer");
const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("Geni", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(
        chalk.yellow(
            figlet.textSync("Welcome to Geni", {
                horizontalLayout: "default",
                verticalLayout: "default"
                })
        )
    );
};



// const createFile = (filename, extension) => {
//     const filePath = `${process.cwd()}/${filename}.${extension}`
//     shell.touch(filePath);
//     return filePath;
// };

const success = filepath => {
    console.log(
        chalk.white.bgGreen.bold(`Done! File created at ${filepath}`)
    );
};

const run = async () => {
    // show script introduction
    init();
// collect data 
    // ask questions
    const answers = await askQuestions();
    const { FRAMEWORK, TOOL, OUTPUTPATH, INPUTPATH, ISAIBASED } = answers;
    console.log({ FRAMEWORK, TOOL, OUTPUTPATH, INPUTPATH, ISAIBASED });
    if (ISAIBASED) {
        const answers = await askQuestionsForAI();
        const { FRAMEWORK, CONTRACTPATH } = answers;
        console.log({ FRAMEWORK });
        if (FRAMEWORK === "chatGPT") {
            const answers = await askQuestionsForChatGPT();
            const { GPTKEY } = answers;
            console.log({ GPTKEY });
            const files = await getContractFile(INPUTPATH, OUTPUTPATH);
            files.map(async (file) => {
                const { filePath, filename, outputPath } = file;
                try {
                    //  inuputFile, filename
                    const data = await generateGPTFuz(filePath, filename, CONTRACTPATH, GPTKEY );
                    await WriteJsFile(outputPath, data.toString().replace(/},/g, '}'));
                    console.log(`File written: ${outputPath}`);
                } catch (error) {
                    console.error(`Error processing file: ${filePath}`, error);
                }
            }
            );
        }
    } else {
        const files = await getContractFile(INPUTPATH, OUTPUTPATH);
        files.map(async (file) => {
            const { filePath, filename, outputPath } = file;
            try {
                //  inuputFile, filename
                const data = await generateUnitTest(filePath, filename);
                await WriteJsFile(outputPath, data.toString().replace(/},/g, '}'));
                console.log(`File written: ${outputPath}`);
            } catch (error) {
                console.error(`Error processing file: ${filePath}`, error);
            }
        }
        );
    
       
    }
    // validate 
// generate 
    // write 
     //success(filePath);
};


function generateAiBasedEchidnaFuzz(inputPath,outputDir,aiModel,aiKey) {
    
}
function generateAiBasedFoundryFuzz(inputPath,outputDir,aiModel,aiKey) {
    
}
// get contract file from directory
const getContractFile = async (inputPath, outputDir) => {

    let result = [{}];
    // const dirName = path.basename(inputPath, path.extname(inputPath));

    const dirFiles = await fse.readdir(inputPath);
    console.log(`Generating solidity test in ${outputDir} for contract artifact in ${inputPath}`);
    for (const file of dirFiles) {
        const filename = path.basename(file, path.extname(file));
        console.log({ filename });

        console.log(`Reading ${inputPath}/${file}...`);

        const filePath = `${inputPath}/${file}`;
        const stats = fs.lstatSync(filePath);

        if (stats.isFile()) {
            const outputPath = `${outputDir}/${filename}.sol`;
               let data = { filePath, filename, outputPath };
                result.push(data);
        }
    }
    return result;


}
run();