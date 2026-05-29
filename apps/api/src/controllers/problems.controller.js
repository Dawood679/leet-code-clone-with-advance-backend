const { prisma } = require('@repo/db');

async function getAll(req, res, next) {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        acceptedCount: true,
        totalCount: true
      },
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
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        constraints: true,
        examples: true,
        tags: true,
        acceptedCount: true,
        totalCount: true
      }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json({ problem });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getBySlug };
