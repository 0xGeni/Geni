const arg = require('arg');
const path = require("path");

const serviceGen = require('./index');

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--help': Boolean,
            '--dir': String,
            '--framework': String,
            '--tool': String,
            '-d': '--dir',
            '-f': '--framework',
            '-t': '--tool',
            '-h': '--help',

        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        contractsBuildDir: args['--dir'] ,
        framework: args['--framework'] ,
        tool: args['--tool'] ,
        help: args._[0] || args['--help'],

    };
}

export async function cli(args) {

    let options = parseArgumentsIntoOptions(args);
    options.contractsBuildDir = path.resolve(path.join(process.cwd(), options.contractsBuildDir))
    await serviceGen(options);
}

// ...
