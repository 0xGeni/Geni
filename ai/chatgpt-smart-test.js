const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
async function chatGPTResult(smartContractPath, unitTest, openaiApiKey) {

    const openai = new OpenAIApi(new Configuration({ apiKey: openaiApiKey }));
    openai.api_key = openaiApiKey;
    const smartContract = await fs.readFileSync(smartContractPath, 'utf-8');
    const prompt = `Generate internal logic for the following unit test:\n\n${unitTest}\n\nbased on the following Solidity smart contract:\n\n${smartContract}\n\n Give only the solidity internal test code, don't give extra information or intro sentences at all: GIVE ME ONLY solidity code`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    return (completion?.data?.choices[0]?.message?.content);

}
module.exports = {
     chatGPTResult
}