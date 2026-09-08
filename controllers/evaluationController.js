const Application = require('../models/Application');
const Evaluation = require('../models/Evaluation');
const scoringService = require('../services/scoringService');

exports.getEvaluate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('challenge')
      .populate('startup');
      
    if (!application) return res.redirect('/government/challenges');

    const existingEval = await Evaluation.findOne({ application: application._id, evaluator: req.session.user._id });

    res.render('layouts/main', { body: 'applications/evaluate', application, existingEval });
  } catch (err) {
    console.error(err);
    res.redirect('/government/challenges');
  }
};

exports.postEvaluate = async (req, res) => {
  try {
    const { technicalFeasibility, expectedImpact, innovation, scalability, costEffectiveness, comments, action } = req.body;
    
    const evaluation = new Evaluation({
      application: req.params.id,
      evaluator: req.session.user._id,
      technicalFeasibility: Number(technicalFeasibility),
      expectedImpact: Number(expectedImpact),
      innovation: Number(innovation),
      scalability: Number(scalability),
      costEffectiveness: Number(costEffectiveness),
      comments
    });
    
    evaluation.finalScore = scoringService.calculateEvaluationScore(evaluation);
    await evaluation.save();
    
    // Update application status
    const app = await Application.findById(req.params.id);
    if (action === 'shortlist') {
      app.status = 'SHORTLISTED';
    } else if (action === 'reject') {
      app.status = 'REJECTED';
    } else {
      app.status = 'UNDER_REVIEW'; // Just saving draft evaluation
    }
    await app.save();

    req.session.success = 'Evaluation saved successfully.';
    res.redirect(`/government/challenges/${app.challenge}/applications`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to save evaluation.';
    res.redirect(`/government/applications/${req.params.id}/evaluate`);
  }
};

exports.getRanking = async (req, res) => {
  try {
    const challenge = await require('../models/Challenge').findById(req.params.id);
    const applications = await Application.find({ challenge: req.params.id }).populate('startup');
    
    // Get evaluations for these applications
    const appsWithScores = await Promise.all(applications.map(async (app) => {
      // Find average or latest evaluation score
      const evals = await Evaluation.find({ application: app._id });
      const avgScore = evals.length > 0 ? (evals.reduce((sum, e) => sum + e.finalScore, 0) / evals.length).toFixed(1) : null;
      
      return {
        _id: app._id,
        startup: app.startup,
        status: app.status,
        matchScore: app.matchScore,
        evalScore: avgScore
      };
    }));
    
    // Sort primarily by eval score, then match score
    appsWithScores.sort((a, b) => {
      if (a.evalScore !== null && b.evalScore !== null) return b.evalScore - a.evalScore;
      if (a.evalScore !== null) return -1;
      if (b.evalScore !== null) return 1;
      return b.matchScore - a.matchScore;
    });

    res.render('layouts/main', { body: 'applications/ranking', challenge, rankedApplications: appsWithScores });
  } catch (err) {
    console.error(err);
    res.redirect('/government/challenges');
  }
};
