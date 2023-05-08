#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const { askQuestions, askQuestionsForAI, askQuestionsForChatGPT } = require("./lib/inquirer");
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
        const { FRAMEWORK } = answers;
        console.log({ FRAMEWORK });
        if (FRAMEWORK === "chatGPT") {
            const answers = await askQuestionsForChatGPT();
            const { GPTKEY } = answers;
            console.log({ GPTKEY });
        }
    }
    // validate 
// generate 
    // write 
     success(filePath);
};


function generateAiBasedEchidnaFuzz(inputPath,outputDir,aiModel,aiKey) {
    
}
function generateAiBasedFoundryFuzz(inputPath,outputDir,aiModel,aiKey) {
    
}

run();