const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config');

let genAI;

function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

async function generateTestCases(description, examples = []) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

  const examplesText = examples.length
    ? `\n\nExamples:\n${examples.map(e => `Input: ${e.input}\nOutput: ${e.output}`).join('\n\n')}`
    : '';

  const prompt = `You are a competitive programming test case generator.

Given this problem description, generate exactly 10 diverse test cases covering:
- The provided examples
- Edge cases (empty input, single element, negative numbers, etc.)
- Large/boundary inputs
- Normal cases

Problem Description:
${description}${examplesText}

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  { "input": "...", "expectedOutput": "..." },
  ...
]

The input and expectedOutput should match what the problem expects.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON array');

  const testCases = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(testCases)) throw new Error('Expected array of test cases');

  return testCases.slice(0, 10);
}

module.exports = { generateTestCases };
