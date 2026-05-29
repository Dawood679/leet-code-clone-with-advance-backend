const { z } = require('zod');
const { prisma } = require('@repo/db');
const { addJob } = require('../services/queue.service');

const submitSchema = z.object({
  problemId: z.string().min(1),
  code: z.string().min(1),
  language: z.enum(['python', 'javascript', 'java', 'cpp'])
});

async function create(req, res, next) {
  try {
    const { problemId, code, language } = submitSchema.parse(req.body);

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, testCases: true }
    });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const submission = await prisma.submission.create({
      data: { userId: req.user.id, problemId, code, language, status: 'PENDING' }
    });

    await addJob({
      submissionId: submission.id,
      code,
      language,
      testCases: problem.testCases,
      userId: req.user.id
    });

    res.status(202).json({ submissionId: submission.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id }
    });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    if (submission.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ submission });
  } catch (err) {
    next(err);
  }
}

async function getForProblem(req, res, next) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user.id, problemId: req.params.problemId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ submissions });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, getForProblem };
