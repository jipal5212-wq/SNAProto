const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController');
const { requireRole } = require('../middleware/auth');

router.get('/startup/profile', requireRole(['STARTUP']), startupController.getProfile);
router.post('/startup/profile', requireRole(['STARTUP']), startupController.postProfile);

module.exports = router;
