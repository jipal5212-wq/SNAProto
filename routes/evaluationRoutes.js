const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { requireRole } = require('../middleware/auth');

router.get('/government/applications/:id/evaluate', requireRole(['EVALUATOR', 'GOVERNMENT', 'ADMIN']), evaluationController.getEvaluate);
router.post('/government/applications/:id/evaluate', requireRole(['EVALUATOR', 'GOVERNMENT', 'ADMIN']), evaluationController.postEvaluate);

router.get('/government/challenges/:id/ranking', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), evaluationController.getRanking);
router.post('/government/challenges/:id/rag-shortlist', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), evaluationController.postTriggerRagShortlist);
router.post('/government/challenges/:id/rag-search', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), evaluationController.postRagSearch);

module.exports = router;
