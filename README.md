![Alt text](images/GENI_logo.png)


# Geni, the specifications' generator for security tests

Geni is a builder tool that eases the writing of specifications of blockchain smart contracts. These specifications are required to run several auditing services like Foundry or Echidna.

![Alt text](images/GENI_workflow.png)


## Installation

`npm install`
`yarn install`

## Usage

Geni uses OpenAI functionnalities to generate the best specifications possible. Thus, it needs to be configured with your account's secret key, which is available on the [website](https://beta.openai.com/account/api-keys).
## How it works
1. `npm i geni-generator`
2. ` geni -f  hardhat -t echidna -d ./echidna-exemples/echidna-hh/artifacts/contracts/Lock.sol/`
## Configuration
1. your contract build directory ` '-d': '--dir'` 
   2. framework used         `'-f': '--framework'`
     3. generate specification/test for which tool       `'-t': '--tool'`
       4. need help     `'-h': '--help'` 
## framwork & tools Suported
1. hardhat with echidna 
2. foundry
## Future work
1. 

### Request options

Here are the options you need to configure to run the tool.

## Tests
TBA