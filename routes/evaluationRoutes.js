const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { requireRole } = require('../middleware/auth');

router.get('/government/applications/:id/evaluate', requireRole(['EVALUATOR', 'GOVERNMENT', 'ADMIN']), evaluationController.getEvaluate);
router.post('/government/applications/:id/evaluate', requireRole(['EVALUATOR', 'GOVERNMENT', 'ADMIN']), evaluationController.postEvaluate);

router.get('/government/challenges/:id/ranking', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), evaluationController.getRanking);

module.exports = router;
