#!/usr/bin/env node
const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const figlet = require("figlet");
const { WriteJsFile } = require("./writer.js");
const { generateGPTFuz, generateUnitTest } = require("./tools/foundry.fuzz.js");
const {
  askQuestions,
  askQuestionsForAI,
  askQuestionsForChatGPT,
  askQuestionsForNonSupportedFramework,
  askQuestionsForAINunSupportedSolidityFramework,
} = require("./inquirer");
const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Geni", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(
    chalk.yellow(
      figlet.textSync("Welcome to Geni", {
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
};

// const createFile = (filename, extension) => {
//     const filePath = `${process.cwd()}/${filename}.${extension}`
//     shell.touch(filePath);
//     return filePath;
// };

const success = (filepath) => {
  console.log(chalk.green.bold(`Done! File created at ${filepath}`));
};
const nonSupportedMsg = () => console.log(
    chalk.red.bold(`Currently not supported, please stay tuned`)
); 
const run = async () => {
  // show script introduction
  let inquirerAnswers = {
    FRAMEWORK: "",
      TOOL: "",
      TYPE:"",
    OUTPUTPATH: "",
    INPUTPATH: "./contracts",
    ISAIBASED: false,
    AIFRAMEWORK: "",
    CONTRACTPATH: "./contracts",
    GPTKEY: "",
  };
  let inputPath;
  console.log(chalk.yellow.bold(`Done! File created at `));
  init();
  // collect data
  // ask questions
  const answers1 = await askQuestions();
  inquirerAnswers.FRAMEWORK = answers1.FRAMEWORK;
  inquirerAnswers.TOOL = answers1.TOOL;
    inquirerAnswers.TYPE = answers1.TYPE;
  inquirerAnswers.OUTPUTPATH = answers1.OUTPUTPATH;
  inquirerAnswers.INPUTPATH = answers1.INPUTPATH;
  inquirerAnswers.ISAIBASED = answers1.ISAIBASED;
  if (inquirerAnswers.FRAMEWORK === "Others") {
    const path = await askQuestionsForNonSupportedFramework();
    inquirerAnswers.INPUTPATH = path.INPUTPATH;
  } else {
    inquirerAnswers.INPUTPATH = "./contracts";
  }
    if (inquirerAnswers.ISAIBASED) {
        const answers2 = await askQuestionsForAI();
        if (inquirerAnswers.FRAMEWORK === "Others") {
            const answers3 = askQuestionsForAINunSupportedSolidityFramework();
            inquirerAnswers.CONTRACTPATH = answers3.CONTRACTPATH;
        }
        inquirerAnswers.AIFRAMEWORK = answers2.AIFRAMEWORK;
        inquirerAnswers.CONTRACTPATH = answers2.CONTRACTPATH;
        if (inquirerAnswers.AIFRAMEWORK === "chatGPT") {
            const answers4 = await askQuestionsForChatGPT();
            const { GPTKEY } = answers4;
            inquirerAnswers.GPTKEY = answers4.GPTKEY;
        }
    }
    const files = await getContractFile(inquirerAnswers.INPUTPATH, inquirerAnswers. OUTPUTPATH);
// first we need to know what user wants to do , fuz, unit test or what?
    // then we need to know the tools
    // then we need to know if user wants smart result using AI
    files.map(async (file) => {
        const { filePath, filename, outputPath } = file;
        let data;
        if (inquirerAnswers.TYPE == "Fuzz Test") {
            if (inquirerAnswers.TOOL == "Echedna") {
                if (inquirerAnswers.ISAIBASED) {
                    if (inquirerAnswers.AIFRAMEWORK === "chatGPT") {
                       
                            try {// should update it with echidna 
                                 data = await generateGPTFuz(
                                    filePath,
                                    filename,
                                    inquirerAnswers.CONTRACTPATH,
                                    inquirerAnswers.GPTKEY
                                );
                                   } catch (error) {
                                console.error(
                                    chalk.red.bold(`Error processing file: ${filePath}`, error)
                                );
                            }
                       
                    } else {
                        nonSupportedMsg();
                        return;
                    }
                } else {
                    // to be updated later on
                    try {
                        data = await generateUnitTest(filePath, filename);
                    } catch (error) {
                        console.error(
                            chalk.red.bold(`Error processing file: ${filePath}`, error)
                        );
                    }
                }
            } else if (inquirerAnswers.TOOL == "Foundry") {
                try {
                    data = await generateGPTFuz(
                        filePath,
                        filename,
                        inquirerAnswers.CONTRACTPATH,
                        inquirerAnswers.GPTKEY
                    );
                } catch (error) {
                    console.error(
                        chalk.red.bold(`Error processing file: ${filePath}`, error)
                    );
                }
            } else {
                nonSupportedMsg();
                return;
            }
        
        } else if (inquirerAnswers.TYPE == "Unit Test") {
            try {
                data = await generateUnitTest(filePath, filename);
            } catch (error) {
                console.error(
                    chalk.red.bold(`Error processing file: ${filePath}`, error)
                );
            }
        } else if (inquirerAnswers.TYPE == "Formal Verification") {
            nonSupportedMsg();
            return;
        } else if (inquirerAnswers.TYPE == "Symbolic Execution") {
            nonSupportedMsg();
            return;
        }

        if (data != undefined || data != null) {
            await WriteJsFile(outputPath, data.toString().replace(/},/g, "}"));
            console.log(chalk.green(`File written: ${outputPath}`));

        }
    });
 

   
 
  
  // validate
  // generate
  // write
  //success(filePath);
};
// get contract file from directory
const getContractFile = async (inputPath, outputDir) => {
  let result = [];
  const dirName = path.basename(inputPath, path.extname(inputPath));
  const dirFiles = await fse.readdir(inputPath);
  console.log(
    chalk.yellow.bold(
      `Generating solidity test in ${outputDir} for contract artifact in ${inputPath}`
    )
  );
  for (const file of dirFiles) {
    const filename = path.basename(file, path.extname(file));
    if (filename === dirName) {
      console.log(chalk.cyan(`Reading ${inputPath}/${file}...`));

      const filePath = `${inputPath}/${file}`;
      const stats = fs.lstatSync(filePath);

      if (stats.isFile()) {
        const outputPath = `${outputDir}/${filename}.sol`;
        let data = { filePath, filename, outputPath };
        result.push(data);
      }
    }
  }
  return result;
};
// get all contract files from contract directory , recursive
const getContractNameRec = async (inputPath) => {
  let result = [];
  const dirFiles = await fse.readdir(inputPath);
  for (const file of dirFiles) {
    const filename = path.basename(file, path.extname(file));
    const filePath = `${inputPath}/${file}`;
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      const files = await getContractNameRec(filePath);
      result = [...result, ...files];
    } else if (stats.isFile()) {
      result.push(filename);
    }
  }
  return result;
};
// getContractNameRec("./contracts").then((result) => {
//   console.log({ result });
// });
run();
