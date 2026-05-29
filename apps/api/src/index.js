const http = require('http');
const app = require('./app');
const { initSocketServer } = require('./services/socket.service');
const { queueEvents, submissionQueue } = require('./services/queue.service');
const { emitToUser } = require('./services/socket.service');
const { prisma } = require('@repo/db');
const { PORT } = require('./config');

const httpServer = http.createServer(app);
initSocketServer(httpServer);

queueEvents.on('progress', async ({ jobId, data }) => {
  try {
    const { userId, submissionId, status, results } = data;
    emitToUser(userId, 'submission:result', { submissionId, status, results });
  } catch (err) {
    console.error('QueueEvents progress handler error:', err);
  }
});

queueEvents.on('failed', async ({ jobId }) => {
  try {
    const job = await submissionQueue.getJob(jobId);
    if (job?.data?.submissionId) {
      await prisma.submission.update({
        where: { id: job.data.submissionId },
        data: { status: 'RUNTIME_ERROR' }
      });
      if (job.data.userId) {
        emitToUser(job.data.userId, 'submission:result', {
          submissionId: job.data.submissionId,
          status: 'RUNTIME_ERROR',
          results: null
        });
      }
    }
  } catch (err) {
    console.error('QueueEvents failed handler error:', err);
  }
});

httpServer.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
