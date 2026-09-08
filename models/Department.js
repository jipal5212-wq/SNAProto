const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sector: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', departmentSchema);
