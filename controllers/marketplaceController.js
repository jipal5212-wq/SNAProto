const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const matchingService = require('../services/matchingService');

const mongoose = require('mongoose');

exports.getMarketplace = async (req, res) => {
  try {
    let challenges = [];
    if (mongoose.connection.readyState === 1) {
      challenges = await Challenge.find({ status: 'PUBLISHED' })
        .populate('department')
        .sort({ createdAt: -1 });
    }
    res.render('layouts/main', { body: 'challenges/marketplace', challenges });
  } catch (err) {
    console.error('Marketplace query error:', err.message);
    res.render('layouts/main', { body: 'challenges/marketplace', challenges: [] });
  }
};

exports.getChallengeDetails = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('department');
    if (!challenge) {
      req.session.error = 'Challenge not found.';
      return res.redirect('/challenges');
    }

    let hasApplied = false;
    let matchScore = null;
    let matchExplanation = null;

    if (req.session.user && req.session.user.role === 'STARTUP') {
      const existingApplication = await Application.findOne({
        challenge: challenge._id,
        startup: req.session.user.startup
      });
      hasApplied = !!existingApplication;
      
      const startup = await Startup.findById(req.session.user.startup);
      if (startup) {
        const matchResult = await matchingService.calculateMatch(challenge, startup);
        matchScore = matchResult.score;
        matchExplanation = matchResult.explanation;
      }
    }

    res.render('layouts/main', { body: 'challenges/details', challenge, hasApplied, matchScore, matchExplanation });
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to load challenge.';
    res.redirect('/challenges');
  }
};
