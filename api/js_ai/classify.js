const { ChatGoogleGenerativeAI }=require('@langchain/google-genai');
const { GOOGLE_API_KEY } = require('../src/variables');
// require("dotenv").config();



const systemPrompt = `
You are a helpful assistant to classify text into one of these categories:
"technology","sports","politics","science","education".
Answer only with one word (the classification).
`;

const llm = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

async function classify_article(text) {
  try {
    const result = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: text}
    ]);
    return result.content
  } catch (err) {
    console.error("Error:", err);
    return null
  }
}



module.exports=classify_article