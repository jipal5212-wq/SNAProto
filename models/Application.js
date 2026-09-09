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
  matchScore: { type: Number, default: 0 }, // Computed heuristic match score
  documentFile: { type: String }, // Path to uploaded PDF or DOCX
  ragSolutionId: { type: Number },
  ragEligible: { type: Boolean, default: true },
  ragEligibilityReason: { type: String },
  ragConsistencyFlags: [{ type: String }],
  ragScore: { type: Number },
  ragDimensions: {
    relevance: { type: Number },
    feasibility: { type: Number },
    innovation: { type: Number },
    teamCredibility: { type: Number },
    pilotReadiness: { type: Number }
  },
  ragJustifications: {
    relevance: { type: String },
    feasibility: { type: String },
    innovation: { type: String },
    teamCredibility: { type: String },
    pilotReadiness: { type: String }
  }
});

module.exports = mongoose.model('Application', applicationSchema);
