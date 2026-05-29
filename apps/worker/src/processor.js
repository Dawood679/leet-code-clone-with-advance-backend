const { prisma } = require('@repo/db');
const { submitCode, pollResult } = require('./judge0');

const JUDGE0_STATUS_MAP = {
  3: 'ACCEPTED',
  4: 'WRONG_ANSWER',
  5: 'TIME_LIMIT_EXCEEDED',
  6: 'COMPILE_ERROR',
  7: 'RUNTIME_ERROR',
  8: 'RUNTIME_ERROR',
  9: 'RUNTIME_ERROR',
  10: 'RUNTIME_ERROR',
  11: 'RUNTIME_ERROR',
  12: 'RUNTIME_ERROR'
};

async function processSubmission(job) {
  const { submissionId, code, language, testCases, userId } = job.data;

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'PROCESSING' }
  });

  const results = [];
  let overallStatus = 'ACCEPTED';
  let maxRuntime = 0;
  let maxMemory = 0;
  let compileError = null;

  for (const tc of testCases) {
    let tcResult = { input: tc.input, expectedOutput: tc.expectedOutput, status: 'ACCEPTED' };

    try {
      const token = await submitCode({
        source_code: code,
        language,
        stdin: tc.input,
        expected_output: tc.expectedOutput
      });

      const judgeResult = await pollResult(token);
      const statusId = judgeResult.status?.id || 0;
      const tcStatus = JUDGE0_STATUS_MAP[statusId] || 'RUNTIME_ERROR';

      tcResult = {
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: judgeResult.stdout || '',
        status: tcStatus,
        runtime: judgeResult.time ? Math.round(parseFloat(judgeResult.time) * 1000) : null,
        memory: judgeResult.memory || null,
        stderr: judgeResult.stderr || null,
        compileOutput: judgeResult.compile_output || null
      };

      if (tcResult.runtime) maxRuntime = Math.max(maxRuntime, tcResult.runtime);
      if (tcResult.memory) maxMemory = Math.max(maxMemory, tcResult.memory);

      if (tcStatus === 'COMPILE_ERROR') {
        compileError = judgeResult.compile_output;
        overallStatus = 'COMPILE_ERROR';
        results.push(tcResult);
        break;
      }

      if (tcStatus !== 'ACCEPTED' && overallStatus === 'ACCEPTED') {
        overallStatus = tcStatus;
      }
    } catch (err) {
      tcResult = { ...tcResult, status: 'RUNTIME_ERROR', stderr: err.message };
      if (overallStatus === 'ACCEPTED') overallStatus = 'RUNTIME_ERROR';
    }

    results.push(tcResult);
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: overallStatus,
      runtime: maxRuntime || null,
      memory: maxMemory || null,
      results
    }
  });

  await prisma.problem.update({
    where: { id: (await prisma.submission.findUnique({ where: { id: submissionId }, select: { problemId: true } })).problemId },
    data: {
      totalCount: { increment: 1 },
      ...(overallStatus === 'ACCEPTED' ? { acceptedCount: { increment: 1 } } : {})
    }
  });

  await job.updateProgress({ userId, submissionId, status: overallStatus, results });

  return { status: overallStatus, results };
}

module.exports = { processSubmission };
