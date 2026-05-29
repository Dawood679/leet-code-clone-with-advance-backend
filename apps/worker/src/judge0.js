const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54
};

const client = axios.create({
  baseURL: JUDGE0_URL,
  timeout: 30000
});

async function submitCode({ source_code, language, stdin, expected_output }) {
  const language_id = LANGUAGE_IDS[language];
  if (!language_id) throw new Error(`Unsupported language: ${language}`);

  const response = await client.post('/submissions', {
    source_code,
    language_id,
    stdin: stdin || '',
    expected_output: expected_output || ''
  }, {
    params: { base64_encoded: false, wait: false }
  });

  return response.data.token;
}

async function pollResult(token, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await client.get(`/submissions/${token}`, {
      params: { base64_encoded: false }
    });
    const result = response.data;

    if (result.status && result.status.id >= 3) {
      return result;
    }

    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Judge0 polling timed out');
}

module.exports = { submitCode, pollResult, LANGUAGE_IDS };
