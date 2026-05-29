const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { processSubmission } = require('./processor');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

const worker = new Worker('code-execution', processSubmission, {
  connection,
  concurrency: 5
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed: ${result.status}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('Worker started, listening for code-execution jobs...');
