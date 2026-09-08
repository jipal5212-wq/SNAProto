const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { requireRole } = require('../middleware/auth');

router.get('/government/challenges', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), challengeController.getChallenges);
router.get('/government/challenges/create', requireRole(['GOVERNMENT', 'ADMIN']), challengeController.getCreateChallenge);
router.post('/government/challenges/create', requireRole(['GOVERNMENT', 'ADMIN']), challengeController.postCreateChallenge);
router.get('/government/challenges/:id', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), challengeController.getChallengeDetail);
router.post('/government/challenges/:id/publish', requireRole(['GOVERNMENT', 'ADMIN']), challengeController.publishChallenge);
router.post('/api/ai/structure-problem', requireRole(['GOVERNMENT', 'ADMIN']), challengeController.apiStructureProblem);

module.exports = router;
