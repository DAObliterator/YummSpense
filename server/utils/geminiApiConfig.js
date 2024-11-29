const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../config.env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getRelevantInfoGeminiApi(prompt) {
  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = { getRelevantInfoGeminiApi };
