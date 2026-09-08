const mongoose = require('mongoose');

const pilotSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  objective: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number },
  baseline: { type: String },
  target: { type: String },
  kpis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KPI' }],
  milestones: [{
    name: { type: String },
    status: { type: String, enum: ['PENDING', 'ACTIVE', 'COMPLETED'], default: 'PENDING' }
  }],
  feedback: [{
    rating: { type: Number, min: 1, max: 5 },
    usability: { type: String },
    effectiveness: { type: String },
    reliability: { type: String },
    comments: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  evidence: [{
    filename: { type: String },
    type: { type: String },
    category: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    description: { type: String },
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' }
  }],
  status: { type: String, enum: ['PLANNED', 'ACTIVE', 'COMPLETED', 'VALIDATED', 'SCALE_UP_RECOMMENDED', 'EXTENDED', 'STOPPED'], default: 'PLANNED' }
});

module.exports = mongoose.model('Pilot', pilotSchema);
