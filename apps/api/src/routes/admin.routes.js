const { Router } = require('express');
const {
  getAllProblems, createProblem, getProblemById,
  updateProblem, deleteProblem, generateTests, getSubmissions
} = require('../controllers/admin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { adminMiddleware } = require('../middleware/admin.middleware');

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.get('/problems', getAllProblems);
router.post('/problems', createProblem);
router.post('/problems/generate-tests', generateTests);
router.get('/problems/:id', getProblemById);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);
router.get('/submissions', getSubmissions);

module.exports = router;
