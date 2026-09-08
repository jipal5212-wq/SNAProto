const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['GOVERNMENT', 'STARTUP', 'EVALUATOR', 'ADMIN'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
