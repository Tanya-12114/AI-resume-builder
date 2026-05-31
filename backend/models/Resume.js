const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  summary: String,
  skills: [String],
  education: [Object],
  experiences: [Object],
  projects: [Object],
  certifications: [Object],
  achievements: [Object],
  languages: [Object],
  positionsOfResponsibility: [Object],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);