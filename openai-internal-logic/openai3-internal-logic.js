require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');

async function generateUnitTest(smartContractPath, unitTest) {
    const openaiApiKey = "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";

//   const openaiApiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAIApi(new Configuration({apiKey:openaiApiKey}));
  openai.api_key = openaiApiKey;
  
  const response = await openai.createCompletion({
  model:"text-davinci-003",
  temperature: 0,
  });
  const smartContract = fs.readFileSync(smartContractPath, 'utf-8');
  console.log(smartContract);
  const prompt = `Generate internal logic for the following unit test:\n\n${unitTest}\n\nbased on the following Solidity smart contract:\n\n${smartContract}\n\n Give only the solidity internal test code, don't give extra information or intro sentences at all: GIVE ME ONLY solidity code`;
  
  if (!response || !response.data || response.data.choices.length === 0) {    
    throw new Error('Empty response from OpenAI API');
  }
  
  const logic = response.data.choices[0].text.trim();
  const generatedUnitTest = `${unitTest} {\n${logic}\n}`;
  
  return generatedUnitTest;
}

async function main() {
  const generatedUnitTest = await generateUnitTest('./Counter.sol', 'function testIncrement() public');
  console.log(generatedUnitTest);
}

main();
