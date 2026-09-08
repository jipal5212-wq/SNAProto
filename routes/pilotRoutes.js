const express = require('express');
const router = express.Router();
const pilotController = require('../controllers/pilotController');
const { requireRole } = require('../middleware/auth');

router.get('/government/pilots', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.getGovernmentPilots);
router.get('/government/pilots/create', requireRole(['GOVERNMENT', 'ADMIN']), pilotController.getCreatePilot);
router.post('/government/pilots/create', requireRole(['GOVERNMENT', 'ADMIN']), pilotController.postCreatePilot);
router.get('/government/pilots/:id', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.getPilotDetails);

router.get('/government/pilots/:id/kpis', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.getKpiEntry);
router.post('/government/pilots/:id/kpis', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.postKpiEntry);

router.get('/government/pilots/:id/validation', requireRole(['EVALUATOR', 'ADMIN']), pilotController.getValidation);
router.post('/government/pilots/:id/validation', requireRole(['EVALUATOR', 'ADMIN']), pilotController.postValidation);

router.post('/government/pilots/:id/feedback', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.postFeedback);
router.post('/government/pilots/:id/evidence', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), pilotController.postEvidence);

router.get('/startup/pilots', requireRole(['STARTUP']), pilotController.getStartupPilots);
// Startups can also view pilot details (read-only)
router.get('/startup/pilots/:id', requireRole(['STARTUP']), pilotController.getPilotDetails);

module.exports = router;
