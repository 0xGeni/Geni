const {
    geni:geniEchednaHH
} = require('./echidna-hardhat-generator');
const {
    geni:geniFoundry
} = require('./foundry-generator');



const serviceGen = async ({ contractsBuildDir, tool,framework }) => {
    console.log({ contractsBuildDir, tool, framework });
    if (!contractsBuildDir || !tool || !framework) {
        console.error("missing Required params")
        return
    }
    if (tool == "echidna" && framework == "hardhat") {
   await geniEchednaHH(contractsBuildDir)
    }
    else if (tool == "foundry" && framework == "foundry") {
    await    geniFoundry(contractsBuildDir)
    } else {
        console.info("Not supportd yet")
    }

}

module.exports = serviceGen
