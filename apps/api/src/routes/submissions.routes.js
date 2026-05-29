const { Router } = require('express');
const { create, getById, getForProblem } = require('../controllers/submissions.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', authMiddleware, create);
router.get('/problem/:problemId', authMiddleware, getForProblem);
router.get('/:id', authMiddleware, getById);

module.exports = router;
