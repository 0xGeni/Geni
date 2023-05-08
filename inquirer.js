const inquirer = require("inquirer");

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
            message: "Where is your ABI files?"
        }, {
            name: "OUTPUTPATH",
            type: "input",
            message: "where do you want to generate the file?"
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
    const questions = [
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