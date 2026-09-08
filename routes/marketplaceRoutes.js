const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const { requireAuth } = require('../middleware/auth');

router.get('/challenges', marketplaceController.getMarketplace);
router.get('/challenges/:id', requireAuth, marketplaceController.getChallengeDetails);

module.exports = router;
