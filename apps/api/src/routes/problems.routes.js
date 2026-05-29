const { Router } = require('express');
const { getAll, getBySlug } = require('../controllers/problems.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', authMiddleware, getAll);
router.get('/:slug', authMiddleware, getBySlug);

module.exports = router;
