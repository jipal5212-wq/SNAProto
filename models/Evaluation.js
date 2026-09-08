const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicalFeasibility: { type: Number, min: 0, max: 100 },
  expectedImpact: { type: Number, min: 0, max: 100 },
  innovation: { type: Number, min: 0, max: 100 },
  scalability: { type: Number, min: 0, max: 100 },
  costEffectiveness: { type: Number, min: 0, max: 100 },
  finalScore: { type: Number, default: 0 },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
