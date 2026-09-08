const Challenge = require('../models/Challenge');
const aiService = require('../services/aiService');

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ department: req.session.user.department }).sort({ createdAt: -1 });
    res.render('layouts/main', { body: 'government/challenges/index', challenges });
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to load challenges.';
    res.redirect('/government/dashboard');
  }
};

exports.getChallengeDetail = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('department');
    if (!challenge) {
      req.session.error = 'Challenge not found.';
      return res.redirect('/government/challenges');
    }
    res.render('layouts/main', { body: 'government/challenges/detail', challenge });
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to load challenge.';
    res.redirect('/government/challenges');
  }
};

exports.getCreateChallenge = (req, res) => {
  res.render('layouts/main', { body: 'government/challenges/create' });
};

exports.postCreateChallenge = async (req, res) => {
  try {
    const {
      title, rawProblem, problemStatement, desiredOutcome, target,
      budgetMin, budgetMax, pilotDuration, status
    } = req.body;
    
    // Convert comma-separated string to arrays
    const kpis = req.body.kpis ? req.body.kpis.split(',').map(s => s.trim()) : [];
    const technologies = req.body.technologies ? req.body.technologies.split(',').map(s => s.trim()) : [];
    const requiredCapabilities = req.body.requiredCapabilities ? req.body.requiredCapabilities.split(',').map(s => s.trim()) : [];

    const newChallenge = new Challenge({
      department: req.session.user.department,
      title,
      rawProblem,
      problemStatement,
      desiredOutcome,
      target,
      budgetMin,
      budgetMax,
      pilotDuration,
      kpis,
      technologies,
      requiredCapabilities,
      status: status || 'DRAFT'
    });

    await newChallenge.save();
    req.session.success = 'Challenge saved successfully.';
    res.redirect('/government/challenges');
  } catch (err) {
    console.error(err);
    req.session.error = 'Error creating challenge.';
    res.redirect('/government/challenges/create');
  }
};

exports.publishChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      req.session.error = 'Challenge not found.';
      return res.redirect('/government/challenges');
    }
    challenge.status = 'PUBLISHED';
    await challenge.save();
    req.session.success = 'Challenge published successfully!';
    res.redirect('/government/challenges/' + challenge._id);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to publish challenge.';
    res.redirect('/government/challenges');
  }
};

exports.apiStructureProblem = async (req, res) => {
  try {
    const { rawProblem } = req.body;
    if (!rawProblem) return res.status(400).json({ error: 'Missing rawProblem' });
    
    const structuredData = await aiService.structureProblem(rawProblem);
    res.json(structuredData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI processing failed' });
  }
};
