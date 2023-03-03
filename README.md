# Geni, the specifications generator for security tests

Geni is a builder tool that ease the writing of specifications of blockchain smart contracts. These specifications are required to run several auditing services like Foundry or Echidna.

## Installation

```bash
$ TBP
```

## Usage

Geni uses OpenAI functionnalities to generate the best specifications possible. Thus, it needs to be configured with your account's secret key, which is available on the [website](https://beta.openai.com/account/api-keys).

### Request options

Here are the options you need to configure to run the tool.

## Tests

### Test the generateEchidnaFunction.js

The generation of Echidna specifications can be test with one specific function for instance :
```bash
$ node generateEchidnaFunctions.js "function add(uint256 a, uint256 b) public pure returns (uint256)"

```