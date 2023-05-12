const fs = require('fs');
const chalk = require("chalk");
const figlet = require("figlet");




const WriteJsFile = async (path, content) => {
    // console.log({ path, content });
    try {
        const obj = await fs.writeFile(path, content, data =>
            console.log(
                chalk.yellow.bold(`Contract functions are written at :  ${path}`)
            ));
            
            
        return true;
    } catch (error) {
        return false;

    }


}

    module.exports = {
        WriteJsFile
    }