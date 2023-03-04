require('dotenv').config();
const openai = require('openai');

async function generateUnitTest(smartContract, unitTest) {

  const openaiApiKey = process.env.OPENAI_API_KEY;
  openai.api_key = openaiApiKey;
  openai.organization = openaiOrganization;

  const engine = "gpt-3.5-turbo"; // the latest engine available (March 2023)
  const prompt = `Generate internal logic for the following unit test:\n\n${unitTest}\n\nbased on the following Solidity smart contract:\n\n${smartContract}\n\n Give only the solidity internal test code, don't give extra information or intro sentences at all: GIVE ME ONLY solidity code`;

  const completions = await openai.complete({
    engine,
    prompt,
    maxTokens: 1024,
    n: 1,
    stop: "\n\n",
    temperature: 0.7,
  });

  const logic = completions.choices[0].text.trim();
  const generatedUnitTest = `${unitTest} {\n${logic}\n}`;
  
  return generatedUnitTest;
}

generateUnitTest()
