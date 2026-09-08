const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  pilot: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  name: { type: String, required: true },
  description: { type: String },
  unit: { type: String },
  direction: { type: String, enum: ['higher_is_better', 'lower_is_better'], required: true },
  baseline: { type: Number, required: true },
  target: { type: Number, required: true },
  measurementFrequency: { type: String },
  measurementMethod: { type: String },
  dataSource: { type: String },
  actualValues: [{
    date: { type: Date, default: Date.now },
    value: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('KPI', kpiSchema);
