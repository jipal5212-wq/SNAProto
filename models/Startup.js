const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String },
  industries: [{ type: String }],
  technologies: [{ type: String }],
  capabilities: [{ type: String }],
  products: [{ type: String }],
  teamSize: { type: String },
  stage: { type: String },
  foundedYear: { type: Number },
  previousProjects: [{ type: String }],
  governmentProjects: [{ type: String }],
  pilotReady: { type: Boolean, default: false },
  regions: [{ type: String }]
});

module.exports = mongoose.model('Startup', startupSchema);
