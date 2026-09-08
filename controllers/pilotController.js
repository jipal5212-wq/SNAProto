const Pilot = require('../models/Pilot');
const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const KPI = require('../models/KPI');
const Validation = require('../models/Validation');
const Recommendation = require('../models/Recommendation');
const recommendationService = require('../services/recommendationService');

// Pilot Creation
exports.getCreatePilot = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.query.challenge);
    const startup = await Startup.findById(req.query.startup);
    if (!challenge || !startup) return res.redirect('/government/challenges');
    
    res.render('layouts/main', { body: 'pilots/create', challenge, startup });
  } catch (err) {
    console.error(err);
    res.redirect('/government/dashboard');
  }
};

exports.postCreatePilot = async (req, res) => {
  try {
    const { challengeId, startupId, objective, location, startDate, endDate, budget, kpiNames, kpiBaselines, kpiTargets, kpiDirections } = req.body;
    
    const pilot = new Pilot({
      challenge: challengeId,
      startup: startupId,
      department: req.session.user.department,
      objective, location, startDate, endDate, budget,
      status: 'ACTIVE'
    });
    
    // Save KPIs
    const kpiNamesArr = Array.isArray(kpiNames) ? kpiNames : [kpiNames];
    const kpiBaselinesArr = Array.isArray(kpiBaselines) ? kpiBaselines : [kpiBaselines];
    const kpiTargetsArr = Array.isArray(kpiTargets) ? kpiTargets : [kpiTargets];
    const kpiDirectionsArr = Array.isArray(kpiDirections) ? kpiDirections : [kpiDirections];
    
    await pilot.save();
    
    for (let i = 0; i < kpiNamesArr.length; i++) {
      if (kpiNamesArr[i]) {
        const kpi = new KPI({
          pilot: pilot._id,
          name: kpiNamesArr[i],
          direction: kpiDirectionsArr[i] || 'higher_is_better',
          baseline: Number(kpiBaselinesArr[i]),
          target: Number(kpiTargetsArr[i]),
          actualValues: []
        });
        await kpi.save();
        pilot.kpis.push(kpi._id);
      }
    }
    await pilot.save();

    // Update Application
    const app = await Application.findOne({ challenge: challengeId, startup: startupId });
    if (app) {
      app.status = 'PILOT_SELECTED';
      await app.save();
    }

    req.session.success = 'Pilot created and activated successfully!';
    res.redirect(`/government/pilots/${pilot._id}`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to create pilot.';
    res.redirect('/government/pilots');
  }
};

// Pilot Dashboard
exports.getPilotDetails = async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id)
      .populate('challenge startup department kpis')
      .populate({ path: 'feedback.submittedBy', select: 'name role' });
      
    if (!pilot) return res.redirect('/government/pilots');
    
    const validation = await Validation.findOne({ pilot: pilot._id });
    const recommendation = await Recommendation.findOne({ pilot: pilot._id });

    // Calculate KPI progress for view
    const kpiData = pilot.kpis.map(kpi => {
      const latest = kpi.actualValues.length > 0 ? kpi.actualValues[kpi.actualValues.length - 1].value : kpi.baseline;
      let achievement = 0;
      if (kpi.direction === 'higher_is_better') {
        const totalReq = kpi.target - kpi.baseline;
        const currentProg = latest - kpi.baseline;
        achievement = totalReq === 0 ? 100 : (currentProg / totalReq) * 100;
      } else {
        const totalReq = kpi.baseline - kpi.target;
        const currentProg = kpi.baseline - latest;
        achievement = totalReq === 0 ? 100 : (currentProg / totalReq) * 100;
      }
      return { ...kpi.toObject(), latest, achievement: Math.max(0, Math.min(100, Math.round(achievement))) };
    });

    res.render('layouts/main', { body: 'pilots/details', pilot, kpiData, validation, recommendation });
  } catch (err) {
    console.error(err);
    res.redirect('/government/pilots');
  }
};

// Lists
exports.getGovernmentPilots = async (req, res) => {
  try {
    const pilots = await Pilot.find({ department: req.session.user.department }).populate('challenge startup').sort({ startDate: -1 });
    res.render('layouts/main', { body: 'pilots/index', pilots });
  } catch (err) {
    console.error(err);
    res.redirect('/government/dashboard');
  }
};

exports.getStartupPilots = async (req, res) => {
  try {
    const pilots = await Pilot.find({ startup: req.session.user.startup }).populate('challenge department').sort({ startDate: -1 });
    res.render('layouts/main', { body: 'pilots/startup-index', pilots });
  } catch (err) {
    console.error(err);
    res.redirect('/startup/dashboard');
  }
};

// KPI Management
exports.getKpiEntry = async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id).populate('kpis');
    res.render('layouts/main', { body: 'pilots/kpi-entry', pilot });
  } catch (err) {
    console.error(err);
    res.redirect(`/government/pilots/${req.params.id}`);
  }
};

exports.postKpiEntry = async (req, res) => {
  try {
    const { kpiId, value, date } = req.body;
    const kpi = await KPI.findById(kpiId);
    
    if (kpi) {
      kpi.actualValues.push({
        date: date ? new Date(date) : new Date(),
        value: Number(value)
      });
      await kpi.save();
      req.session.success = 'KPI value recorded.';
    }
    res.redirect(`/government/pilots/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to record KPI.';
    res.redirect(`/government/pilots/${req.params.id}/kpis`);
  }
};

// Validation & Recommendation
exports.getValidation = async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id).populate('challenge startup kpis');
    res.render('layouts/main', { body: 'pilots/validation', pilot });
  } catch (err) {
    console.error(err);
    res.redirect(`/government/pilots/${req.params.id}`);
  }
};

exports.postValidation = async (req, res) => {
  try {
    const { validationStatus, kpiAchievement, comments, generateRecommendation } = req.body;
    
    let validation = await Validation.findOne({ pilot: req.params.id });
    if (!validation) {
      validation = new Validation({ pilot: req.params.id, evaluator: req.session.user._id });
    }
    
    validation.validationStatus = validationStatus;
    validation.kpiAchievement = kpiAchievement;
    validation.comments = comments;
    validation.validatedAt = new Date();
    await validation.save();
    
    const pilot = await Pilot.findById(req.params.id);
    pilot.status = validationStatus === 'VALIDATED' ? 'VALIDATED' : 'COMPLETED';
    await pilot.save();

    if (generateRecommendation === 'on') {
      const rec = recommendationService.generateRuleBasedRecommendation(validation, pilot);
      await Recommendation.findOneAndUpdate(
        { pilot: pilot._id },
        { 
          pilot: pilot._id, 
          recommendation: rec.status, 
          reason: rec.reason, 
          generatedBy: 'RULE_ENGINE', 
          createdAt: new Date() 
        },
        { upsert: true, new: true }
      );
      if(rec.status === 'SCALE_UP') {
        pilot.status = 'SCALE_UP_RECOMMENDED';
        await pilot.save();
      }
    }

    req.session.success = 'Validation and Recommendation generated successfully.';
    res.redirect(`/government/pilots/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Validation failed.';
    res.redirect(`/government/pilots/${req.params.id}/validation`);
  }
};

exports.postFeedback = async (req, res) => {
  try {
    const { rating, usability, effectiveness, reliability, comments } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (pilot) {
      pilot.feedback.push({
        rating: Number(rating) || 4,
        usability: usability || 'Good',
        effectiveness: effectiveness || 'High',
        reliability: reliability || 'Stable',
        comments: comments || '',
        submittedBy: req.session.user._id,
        createdAt: new Date()
      });
      await pilot.save();
      req.session.success = 'Stakeholder feedback recorded successfully.';
    }
    res.redirect(`/government/pilots/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to submit feedback.';
    res.redirect(`/government/pilots/${req.params.id}`);
  }
};

exports.postEvidence = async (req, res) => {
  try {
    const { category, description, filename } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (pilot) {
      pilot.evidence.push({
        filename: filename || 'pilot_operational_report.pdf',
        type: 'document',
        category: category || 'Performance Report',
        description: description || 'Field trial telemetry log and verification report',
        uploadedBy: req.session.user._id,
        uploadedAt: new Date(),
        verificationStatus: 'VERIFIED'
      });
      await pilot.save();
      req.session.success = 'Evidence artifact logged successfully.';
    }
    res.redirect(`/government/pilots/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to upload evidence.';
    res.redirect(`/government/pilots/${req.params.id}`);
  }
};
