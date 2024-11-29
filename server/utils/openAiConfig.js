const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../config.env") });

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  organization: process.env.OPEN_AI_ORGANIZATION_ID,
  project: process.env.OPEN_AI_YUMMSPENSE_PID,
});

async function getRelevantInformation(prompt) {
  try {
    const response = await openai.completions.create({
      model: "gpt-4o-mini", // Use the desired model
      prompt: prompt,
      max_tokens: 500, // Adjust based on expected output
      temperature: 0, // Set to 0 for deterministic results
    });

    console.log("Extracted Information:", response.choices[0].text.trim());
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
}

module.exports = { getRelevantInformation };
