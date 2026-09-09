const Application = require('../models/Application');
const Evaluation = require('../models/Evaluation');
const Challenge = require('../models/Challenge');
const scoringService = require('../services/scoringService');
const ragService = require('../services/ragService');
const fs = require('fs');
const path = require('path');

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
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.redirect('/government/challenges');

    const applications = await Application.find({ challenge: req.params.id }).populate('startup');
    const isRagAvailable = await ragService.isAvailable();
    
    // Combine manual evaluations with AI RAG scores
    const appsWithScores = await Promise.all(applications.map(async (app) => {
      const evals = await Evaluation.find({ application: app._id });
      const avgScore = evals.length > 0 ? (evals.reduce((sum, e) => sum + e.finalScore, 0) / evals.length).toFixed(1) : null;
      
      return {
        _id: app._id,
        startup: app.startup,
        solutionTitle: app.solutionTitle,
        documentFile: app.documentFile,
        status: app.status,
        matchScore: app.matchScore,
        evalScore: avgScore,
        ragScore: app.ragScore != null ? app.ragScore : null,
        ragDimensions: app.ragDimensions || {},
        ragJustifications: app.ragJustifications || {},
        ragConsistencyFlags: app.ragConsistencyFlags || [],
        ragEligible: app.ragEligible !== false,
        ragEligibilityReason: app.ragEligibilityReason || ''
      };
    }));
    
    // Sort primarily by AI RAG score if available, then by human evaluation score, then match score
    appsWithScores.sort((a, b) => {
      if (a.ragScore !== null && b.ragScore !== null) return b.ragScore - a.ragScore;
      if (a.ragScore !== null) return -1;
      if (b.ragScore !== null) return 1;
      if (a.evalScore !== null && b.evalScore !== null) return b.evalScore - a.evalScore;
      if (a.evalScore !== null) return -1;
      if (b.evalScore !== null) return 1;
      return b.matchScore - a.matchScore;
    });

    const searchResults = req.session.ragSearchResults || null;
    const searchQuery = req.session.ragSearchQuery || null;
    delete req.session.ragSearchResults;
    delete req.session.ragSearchQuery;

    res.render('layouts/main', {
      body: 'applications/ranking',
      challenge,
      rankedApplications: appsWithScores,
      isRagAvailable,
      searchResults,
      searchQuery
    });
  } catch (err) {
    console.error(err);
    res.redirect('/government/challenges');
  }
};

/**
 * Trigger AI RAG shortlisting across all submitted applications for this challenge.
 */
exports.postTriggerRagShortlist = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      req.session.error = 'Challenge not found.';
      return res.redirect('/government/challenges');
    }

    const isRagAvailable = await ragService.isAvailable();
    if (!isRagAvailable) {
      req.session.error = 'RAG Engine service is not running. Start FastAPI at http://localhost:8000 first.';
      return res.redirect(`/government/challenges/${challenge._id}/ranking`);
    }

    // Step 1: Ensure challenge is registered in RAG engine
    if (!challenge.ragProblemId) {
      challenge.ragProblemId = await ragService.syncProblem(challenge);
      await challenge.save();
    }

    // Step 2: Ensure all applications with proposals are uploaded to RAG
    const applications = await Application.find({ challenge: challenge._id }).populate('startup');
    for (const app of applications) {
      if (!app.ragSolutionId) {
        let filePath = null;
        let isTemp = false;

        if (app.documentFile) {
          const fullPath = path.join(__dirname, '../public', app.documentFile);
          if (fs.existsSync(fullPath)) {
            filePath = fullPath;
          }
        }

        // If no file exists, generate a temporary text proposal from form fields
        if (!filePath) {
          isTemp = true;
          const tempContent = [
            `Startup Name: ${app.startup ? app.startup.name : 'Unknown'}`,
            `DPIIT Registered: ${app.startup && app.startup.dpiitNumber ? 'Yes' : 'Not mentioned'}`,
            `Annual Turnover: Rs ${app.startup && app.startup.annualTurnover ? app.startup.annualTurnover + ' Cr' : 'Not mentioned'}`,
            `Solution Title: ${app.solutionTitle}`,
            `Solution Description: ${app.solutionDescription}`,
            `Technical Approach: ${app.technicalApproach || ''}`,
            `Implementation Plan: ${app.implementationPlan || ''}`,
            `Expected Impact: ${app.expectedImpact || ''}`,
            `Estimated Cost: Rs ${app.estimatedCost || 'Not mentioned'}`
          ].join('\n\n');

          const os = require('os');
          const tempDir = process.env.VERCEL
            ? path.join(os.tmpdir(), 'proposals')
            : path.join(__dirname, '../public/uploads/proposals');
          if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
          filePath = path.join(tempDir, `temp-${app._id}.txt`);
          fs.writeFileSync(filePath, tempContent, 'utf-8');
        }

        try {
          const uploadRes = await ragService.uploadSolutionDoc(
            challenge.ragProblemId,
            app.startup ? app.startup.name : 'Unknown Startup',
            filePath
          );
          if (uploadRes && uploadRes.solution_id) {
            app.ragSolutionId = uploadRes.solution_id;
            app.ragEligible = uploadRes.eligible !== false;
            app.ragEligibilityReason = uploadRes.eligibility_reason || '';
            app.ragConsistencyFlags = uploadRes.consistency_flags || [];
            await app.save();
          }
        } catch (uploadErr) {
          console.warn(`Failed to upload app ${app._id} to RAG:`, uploadErr.message);
        }

        if (isTemp && fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (_) {}
        }
      }
    }

    // Step 3: Run AI Scoring & Ranking
    const shortlistResult = await ragService.getShortlist(challenge.ragProblemId, true);

    if (shortlistResult && shortlistResult.ranked_solutions) {
      for (const ranked of shortlistResult.ranked_solutions) {
        // Find matching application
        const matchedApp = applications.find(a =>
          a.ragSolutionId === ranked.solution_id ||
          (a.startup && a.startup.name.toLowerCase() === (ranked.startup_name || '').toLowerCase())
        );

        if (matchedApp) {
          matchedApp.ragScore = ranked.final_score;
          matchedApp.ragIsDoable = ranked.is_doable !== false;
          matchedApp.ragDoabilityReason = ranked.doability_reason || 'Technical feasibility confirmed.';
          const sc = ranked.scores || {};
          matchedApp.ragDimensions = {
            technicalFit: sc.technical_fit || sc.relevance || 0,
            expectedImpact: sc.expected_impact || sc.relevance || 0,
            feasibility: sc.feasibility || 0,
            costEffectiveness: sc.cost_effectiveness || sc.feasibility || 0,
            scalability: sc.scalability || 3,
            securityPrivacy: sc.security_privacy || 3,
            teamCapability: sc.team_capability || sc.team_credibility || 0,
            innovation: sc.innovation || 0,
            // Legacy aliases
            relevance: sc.technical_fit || sc.relevance || 0,
            teamCredibility: sc.team_capability || sc.team_credibility || 0,
            pilotReadiness: sc.feasibility || 0
          };
          matchedApp.ragJustifications = ranked.justification || {};
          matchedApp.ragConsistencyFlags = ranked.consistency_flags || [];
          await matchedApp.save();
        }
      }
    }

    req.session.success = `AI RAG Shortlisting completed! Evaluated & ranked ${shortlistResult.ranked_solutions ? shortlistResult.ranked_solutions.length : 0} solutions.`;
    res.redirect(`/government/challenges/${challenge._id}/ranking`);
  } catch (err) {
    console.error('RAG Shortlisting Error:', err);
    req.session.error = 'Failed to run AI RAG shortlisting: ' + err.message;
    res.redirect(`/government/challenges/${req.params.id}/ranking`);
  }
};

/**
 * Perform cross-document semantic RAG search across startup solution docs.
 */
exports.postRagSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.ragProblemId) {
      req.session.error = 'Challenge has not been indexed in RAG yet. Run AI shortlisting first.';
      return res.redirect(`/government/challenges/${req.params.id}/ranking`);
    }

    const searchData = await ragService.searchSolutions(challenge.ragProblemId, query);
    req.session.ragSearchResults = searchData.results || [];
    req.session.ragSearchQuery = query;

    res.redirect(`/government/challenges/${req.params.id}/ranking`);
  } catch (err) {
    console.error('RAG Search Error:', err);
    req.session.error = 'Failed to execute search: ' + err.message;
    res.redirect(`/government/challenges/${req.params.id}/ranking`);
  }
};
