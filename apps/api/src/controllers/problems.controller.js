const { prisma } = require('@repo/db');
const { problemAiHelp } = require('../services/gemini.service');

async function getAll(req, res, next) {
  try {
    const problems = await prisma.problem.findMany({
      select: { id: true, title: true, slug: true, difficulty: true, tags: true, acceptedCount: true, totalCount: true },
      orderBy: { createdAt: 'asc' }
    });

    const accepted = await prisma.submission.findMany({
      where: { userId: req.user.id, status: 'ACCEPTED' },
      select: { problemId: true },
      distinct: ['problemId']
    });
    const acceptedSet = new Set(accepted.map(s => s.problemId));

    const result = problems.map(p => ({
      ...p,
      solved: acceptedSet.has(p.id),
      acceptanceRate: p.totalCount > 0 ? Math.round((p.acceptedCount / p.totalCount) * 100) : 0
    }));

    res.json({ problems: result });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true, title: true, slug: true, description: true,
        difficulty: true, constraints: true, examples: true,
        tags: true, acceptedCount: true, totalCount: true,
        starterCode: true, solutions: true
      }
    });

    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json({ problem });
  } catch (err) {
    next(err);
  }
}

async function aiHelp(req, res, next) {
  try {
    const { message, history } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

    const problem = await prisma.problem.findUnique({
      where: { slug: req.params.slug },
      select: { title: true, difficulty: true, description: true, constraints: true }
    });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const reply = await problemAiHelp(problem, message, history || []);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getBySlug, aiHelp };
