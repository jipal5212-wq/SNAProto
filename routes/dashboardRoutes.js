const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireRole } = require('../middleware/auth');

router.get('/government/dashboard', requireRole(['GOVERNMENT', 'EVALUATOR', 'ADMIN']), dashboardController.getGovernmentDashboard);
router.get('/startup/dashboard', requireRole(['STARTUP']), dashboardController.getStartupDashboard);
router.get('/admin/dashboard', requireRole(['ADMIN']), dashboardController.getAdminDashboard);
router.get('/seed', requireRole(['ADMIN']), dashboardController.getSeedPage);
router.post('/seed', requireRole(['ADMIN']), dashboardController.postSeedData);

module.exports = router;
