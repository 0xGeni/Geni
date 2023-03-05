const fs = require('fs');
const fse = require('fs-extra');
var path = require("path");




const WriteJsFile = async (path, content) => {
    // console.log({ path, content });
    try {
        const obj = await fs.writeFile(path, content, data => console.log('Contract functions are written '))
        return true;
    } catch (error) {
        return false;

    }


}

    module.exports = {
        WriteJsFile
    }