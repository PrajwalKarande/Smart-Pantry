const axios = require('axios');
require('dotenv').config();

const AI_API_URL = process.env.AI_API_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_TEMPERATURE = parseInt(process.env.AI_TEMPERATURE) || 0;
const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT) || 60000;

/**
 * Send a prompt to GPT-4 and return the raw text response.
 */
async function askAI(prompt) {
  console.log(`🧠 Sending prompt to AI (${prompt.length} chars)...`);

  const requestBody = {
    temperature: AI_TEMPERATURE,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  try {
    const response = await axios.post(AI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': AI_API_KEY,
      },
      timeout: AI_TIMEOUT,
    });

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log(`✅ AI response received (${content.length} chars)`);
    return content.trim();
  } catch (error) {
    if (error.response) {
      console.error('❌ AI API Error:', error.response.status, error.response.data);
      throw new Error(`AI API returned status ${error.response.status}`);
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ AI API Timeout');
      throw new Error('AI service timed out. Please try again.');
    } else {
      console.error('❌ AI API Error:', error.message);
      throw new Error('Failed to call AI service: ' + error.message);
    }
  }
}

/**
 * Send prompt and parse the response as JSON.
 */
async function askAIForJson(prompt) {
  const rawResponse = await askAI(prompt);
  return parseJsonResponse(rawResponse);
}

/**
 * Parse JSON (handles markdown code blocks from GPT).
 */
function parseJsonResponse(rawResponse) {
  try {
    let cleaned = rawResponse;

    // Strip markdown code blocks if present
    if (cleaned.includes('```json')) {
      cleaned = cleaned.substring(cleaned.indexOf('```json') + 7);
      cleaned = cleaned.substring(0, cleaned.lastIndexOf('```'));
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.substring(cleaned.indexOf('```') + 3);
      cleaned = cleaned.substring(0, cleaned.lastIndexOf('```'));
    }

    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Failed to parse AI JSON:', rawResponse);
    throw new Error('Failed to parse AI response as JSON: ' + error.message);
  }
}

module.exports = {
  askAI,
  askAIForJson,
  parseJsonResponse,
};