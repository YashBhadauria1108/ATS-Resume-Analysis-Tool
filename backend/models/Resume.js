const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: { type: String, required: true },
  jobDesc: { type: String },
  score: { type: Number },
  matchedKeywords: [String],
  missingKeywords: [String],
  suggestions: [String],
  summary: { type: String },
  overallVerdict: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
