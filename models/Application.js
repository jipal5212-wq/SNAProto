const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  solutionTitle: { type: String, required: true },
  solutionDescription: { type: String, required: true },
  technicalApproach: { type: String },
  implementationPlan: { type: String },
  expectedImpact: { type: String },
  estimatedCost: { type: Number },
  pilotRequirements: { type: String },
  status: { type: String, enum: ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'PILOT_SELECTED'], default: 'SUBMITTED' },
  submittedAt: { type: Date, default: Date.now },
  matchScore: { type: Number, default: 0 } // Computed match score
});

module.exports = mongoose.model('Application', applicationSchema);
