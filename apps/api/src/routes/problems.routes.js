const { Router } = require('express');
const { getAll, getBySlug, aiHelp } = require('../controllers/problems.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', authMiddleware, getAll);
router.get('/:slug', authMiddleware, getBySlug);
router.post('/:slug/ai-help', authMiddleware, aiHelp);

module.exports = router;
