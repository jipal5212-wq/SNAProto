const mongoose = require('mongoose');

const validationSchema = new mongoose.Schema({
  pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kpiAchievement: { type: String },
  evidenceVerified: { type: Boolean, default: false },
  technicalValidation: { type: String },
  validationStatus: { type: String, enum: ['VALIDATED', 'PARTIALLY_VALIDATED', 'NOT_VALIDATED'], required: true },
  comments: { type: String },
  validatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Validation', validationSchema);
