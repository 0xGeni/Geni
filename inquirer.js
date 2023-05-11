const inquirer = require("inquirer");
const fse = require('fs-extra');
const askQuestions = () => {
    const questions = [

        {
            name: "TOOL",
            type: "list",
            message: "What do you want to generate?",
            choices: ["fuzz Test"
                , "unit test"
                , "formal verification"
                , "symbolic execution"],


        },
        {
            name: "FRAMEWORK",
            type: "list",
            message: "What is the framework you want to use?",
            choices: ["foundry"
                , "echedna"],




        },
        {
            name: "INPUTPATH",
            type: "input",
            message: "Where is your ABI files? ( folder path )",
            validate: async function (value) {
                if (value.length) {
                    try {
                        // get the direcroty of a given file 
                        
                        await fse.ensureDir(value);
                        return true;
                    } catch (error) {
                        console.log(error);
                        return "Please enter the path of your ABI files.";
                    }

                } else {
                    return "Please enter the path of your ABI files.";
                }
            }
        }, {
            name: "OUTPUTPATH",
            type: "input",
            message: "where do you want to generate the file?",
            validate:  async function (value) {
                if (value.length) {
                    try {
                        await fse.ensureDir(value);
                        return true;
                    } catch (error) {
                        return "Please enter the path of where you want to generate the file.";
                    }
                   
                } else {
                    return "Please enter the path of where you want to generate the file.";
                }
            }
        },
        {
            name: "ISAIBASED",
            type: "confirm",
            message: "Do you  want AI optomized result?",


        },

    ];
    return inquirer.prompt(questions);
};
const askQuestionsForAI = () => {
    const questions = [{
        name: "CONTRACTPATH",
        type: "input",
        message: "where is your solidity contract file?",
        validate: async function (value) {
            if (value.length) {
                try {
                    await fse.ensureDir(value);
                    return true;
                } catch (error) {
                    return "Please enter the path of the solidity contract file exists.";
                }

            } else {
                return "Please enter the path of the solidity contract file exists.";
            }
        }
    },
        {
            name: "FRAMEWORK",
            type: "list",
            message: "What is the framework you want to use?",
            choices: ["chatGPT",
                "openAI"],

        }
    ];
    return inquirer.prompt(questions);
};
const askQuestionsForChatGPT = () => {
    const questions = [
        {
            name: "GPTKEY",
            type: "input",
            message: "ChatGPT API key?"
        },
    ];
    return inquirer.prompt(questions);
};

module.exports = {
    askQuestions,
    askQuestionsForAI,
    askQuestionsForChatGPT
    
}