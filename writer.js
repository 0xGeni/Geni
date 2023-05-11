const fs = require('fs');
const chalk = require("chalk");
const figlet = require("figlet");




const WriteJsFile = async (path, content) => {
    // console.log({ path, content });
    try {
        const obj = await fs.writeFile(path, content, data => console.log(
            chalk.yellow(
                figlet.textSync("Contract functions are written", {
                    font:"threepoint",
                horizontalLayout: "default",
                verticalLayout: "default"
                })
        )));
            
            
        return true;
    } catch (error) {
        return false;

    }


}

    module.exports = {
        WriteJsFile
    }