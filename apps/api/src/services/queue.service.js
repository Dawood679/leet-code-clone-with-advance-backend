const { Queue, QueueEvents } = require('bullmq');
const IORedis = require('ioredis');
const { REDIS_URL } = require('../config');

const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

const submissionQueue = new Queue('code-execution', { connection });

const queueEvents = new QueueEvents('code-execution', { connection: new IORedis(REDIS_URL, { maxRetriesPerRequest: null }) });

async function addJob(data) {
  return submissionQueue.add('execute', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}

module.exports = { submissionQueue, queueEvents, addJob };
