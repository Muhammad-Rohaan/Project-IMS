const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: String },
  score: { type: Number, required: true },
  selectedAnswers: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
