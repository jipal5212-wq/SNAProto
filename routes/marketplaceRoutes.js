const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const gemRegistryController = require('../controllers/gemRegistryController');
const { requireAuth } = require('../middleware/auth');

router.get('/challenges', marketplaceController.getMarketplace);
router.get('/challenges/:id', requireAuth, marketplaceController.getChallengeDetails);

// Government e-Marketplace (GeM) & DPIIT Startup Registry
router.get('/gem-registry', gemRegistryController.getGemRegistry);
router.get('/api/dpiit-verify/:dippNumber', gemRegistryController.verifyDpiit);

module.exports = router;

