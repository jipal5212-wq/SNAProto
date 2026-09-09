const Application = require('../models/Application');
const Challenge = require('../models/Challenge');
const matchingService = require('../services/matchingService');
const ragService = require('../services/ragService');

exports.getApply = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.redirect('/challenges');

    // Prevent duplicate applications
    const existingApp = await Application.findOne({ challenge: challenge._id, startup: req.session.user.startup });
    if (existingApp) {
      req.session.error = 'You have already applied to this challenge.';
      return res.redirect(`/challenges/${challenge._id}`);
    }

    res.render('layouts/main', { body: 'applications/apply', challenge });
  } catch (err) {
    console.error(err);
    res.redirect('/challenges');
  }
};

exports.postApply = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    const {
      solutionTitle, solutionDescription, technicalApproach,
      implementationPlan, expectedImpact, estimatedCost, pilotRequirements
    } = req.body;

    const existingApp = await Application.findOne({ challenge: challenge._id, startup: req.session.user.startup });
    if (existingApp) {
      req.session.error = 'You have already applied to this challenge.';
      return res.redirect(`/challenges/${challenge._id}`);
    }

    // Optional: Pre-compute match score for quick sorting later
    const Startup = require('../models/Startup');
    const startup = await Startup.findById(req.session.user.startup);
    let matchScore = 0;
    if (startup) {
      const matchResult = await matchingService.calculateMatch(challenge, startup);
      matchScore = matchResult.score;
    }

    let documentFile = req.file ? `/uploads/proposals/${req.file.filename}` : null;
    let ragSolutionId = null;
    let ragEligible = true;
    let ragEligibilityReason = '';
    let ragConsistencyFlags = [];

    // Trigger RAG Engine parsing, eligibility check, and vector indexing if doc uploaded
    if (req.file) {
      try {
        const isRagReady = await ragService.isAvailable();
        if (isRagReady) {
          if (!challenge.ragProblemId) {
            challenge.ragProblemId = await ragService.syncProblem(challenge);
            await challenge.save();
          }
          const ragResult = await ragService.uploadSolutionDoc(
            challenge.ragProblemId,
            startup ? startup.name : req.session.user.name,
            req.file.path
          );
          if (ragResult && ragResult.solution_id) {
            ragSolutionId = ragResult.solution_id;
            ragEligible = ragResult.eligible !== false;
            ragEligibilityReason = ragResult.eligibility_reason || '';
            ragConsistencyFlags = ragResult.consistency_flags || [];
          }
        }
      } catch (ragErr) {
        console.warn('RAG processing warning (proceeding with normal application save):', ragErr.message);
      }
    }

    const application = new Application({
      challenge: challenge._id,
      startup: req.session.user.startup,
      solutionTitle,
      solutionDescription,
      technicalApproach,
      implementationPlan,
      expectedImpact,
      estimatedCost,
      pilotRequirements,
      matchScore,
      documentFile,
      ragSolutionId,
      ragEligible,
      ragEligibilityReason,
      ragConsistencyFlags,
      status: ragEligible ? 'SUBMITTED' : 'REJECTED'
    });

    await application.save();

    if (!ragEligible) {
      req.session.error = `Application submitted but flagged INELIGIBLE by procurement filter: ${ragEligibilityReason}`;
    } else {
      req.session.success = 'Application and solution proposal document submitted successfully.';
    }
    res.redirect('/startup/applications');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to submit application: ' + err.message;
    res.redirect(`/challenges/${req.params.id}`);
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ startup: req.session.user.startup })
      .populate('challenge')
      .sort({ submittedAt: -1 });
    res.render('layouts/main', { body: 'applications/my-applications', applications });
  } catch (err) {
    console.error(err);
    res.redirect('/startup/dashboard');
  }
};

exports.getChallengeApplications = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    const applications = await Application.find({ challenge: req.params.id })
      .populate('startup')
      .sort({ matchScore: -1 });

    res.render('layouts/main', { body: 'applications/challenge-applications', challenge, applications });
  } catch (err) {
    console.error(err);
    res.redirect('/government/challenges');
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    let query = {};
    if (req.session.user.role === 'GOVERNMENT' && req.session.user.department) {
      const departmentChallenges = await Challenge.find({ department: req.session.user.department }).select('_id');
      const challengeIds = departmentChallenges.map(c => c._id);
      query = { challenge: { $in: challengeIds } };
    }
    const applications = await Application.find(query)
      .populate('challenge')
      .populate('startup')
      .sort({ submittedAt: -1 });

    res.render('layouts/main', { body: 'applications/all-applications', applications });
  } catch (err) {
    console.error(err);
    res.redirect('/government/dashboard');
  }
};
