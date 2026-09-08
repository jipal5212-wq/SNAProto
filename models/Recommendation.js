const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  recommendation: { type: String, enum: ['SCALE_UP', 'EXTEND_PILOT', 'STOP'], required: true },
  reason: { type: String },
  kpiAchievement: { type: String },
  validationStatus: { type: String },
  feedbackScore: { type: Number },
  generatedBy: { type: String }, // Can be "AI_SERVICE" or "RULE_ENGINE"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
