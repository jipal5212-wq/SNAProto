const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireRole } = require('../middleware/auth');

router.get('/challenges/:id/apply', requireRole(['STARTUP']), applicationController.getApply);
router.post('/challenges/:id/apply', requireRole(['STARTUP']), applicationController.postApply);

router.get('/startup/applications', requireRole(['STARTUP']), applicationController.getMyApplications);
router.get('/government/applications', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), applicationController.getAllApplications);
router.get('/government/challenges/:id/applications', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), applicationController.getChallengeApplications);

module.exports = router;
