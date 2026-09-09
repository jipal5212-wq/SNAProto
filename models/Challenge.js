const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  title: { type: String, required: true },
  problemStatement: { type: String },
  rawProblem: { type: String },
  sector: { type: String },
  affectedUsers: [{ type: String }],
  location: { type: String },
  currentProcess: { type: String },
  baseline: { type: String },
  desiredOutcome: { type: String },
  target: { type: String },
  constraints: [{ type: String }],
  technologies: [{ type: String }],
  requiredCapabilities: [{ type: String }],
  budgetMin: { type: Number },
  budgetMax: { type: Number },
  pilotDuration: { type: String },
  kpis: [{ type: String }],
  deadline: { type: Date },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED'], default: 'DRAFT' },
  aiGenerated: { type: Boolean, default: false },
  ragProblemId: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', challengeSchema);
