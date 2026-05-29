const { z } = require('zod');
const slugify = require('slugify');
const { prisma } = require('@repo/db');
const { generateTestCases } = require('../services/gemini.service');

const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  constraints: z.string().optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional()
  })),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string()
  })),
  tags: z.array(z.string()).optional().default([])
});

async function getAllProblems(req, res, next) {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, difficulty: true, totalCount: true, acceptedCount: true, createdAt: true }
    });
    res.json({ problems });
  } catch (err) {
    next(err);
  }
}

async function createProblem(req, res, next) {
  try {
    const data = problemSchema.parse(req.body);
    const slug = slugify(data.title, { lower: true, strict: true });

    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        difficulty: data.difficulty,
        constraints: data.constraints || null,
        examples: data.examples,
        testCases: data.testCases,
        tags: data.tags
      }
    });
    res.status(201).json({ problem });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function getProblemById(req, res, next) {
  try {
    const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
    if (!problem) return res.status(404).json({ error: 'Not found' });
    res.json({ problem });
  } catch (err) {
    next(err);
  }
}

async function updateProblem(req, res, next) {
  try {
    const data = problemSchema.partial().parse(req.body);
    const updateData = { ...data };
    if (data.title) {
      updateData.slug = slugify(data.title, { lower: true, strict: true });
    }
    const problem = await prisma.problem.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json({ problem });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function deleteProblem(req, res, next) {
  try {
    await prisma.submission.deleteMany({ where: { problemId: req.params.id } });
    await prisma.problem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

async function generateTests(req, res, next) {
  try {
    const { description, examples } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'description is required' });
    }
    const testCases = await generateTestCases(description, examples || []);
    res.json({ testCases });
  } catch (err) {
    next(err);
  }
}

async function getSubmissions(req, res, next) {
  try {
    const submissions = await prisma.submission.findMany({
      include: { user: { select: { email: true } }, problem: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json({ submissions });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProblems, createProblem, getProblemById, updateProblem, deleteProblem, generateTests, getSubmissions };
