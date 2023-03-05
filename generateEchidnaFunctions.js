const { Configuration, OpenAIApi } = require("openai");
process.env.OPENAI_API_KEY = "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"; // Karolina's key, TBC
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateEchidnaFunctions(signature) {
  const prompt = `Given the Solidity function signature "${signature}", please generate the corresponding function specification for the Echidna testing tool.`;
  const response = await openai.createCompletion({
    prompt: prompt,
    engine: "text-davinci-002",
    maxTokens: 512,
    n: 1,
    stop: "\n",
    temperature: 0.5,
  });

  const generatedSpec = response.data.choices[0].text.trim();
  return generatedSpec;
}

if (process.argv.length !== 3) {
  console.error("Usage: node generateEchidnaFunctions.js <function_signature>");
  process.exit(1);
}

const signature = process.argv[2];
generateEchidnaFunctions(signature)
  .then((spec) => console.log(spec))
  .catch((err) => console.error(err));
