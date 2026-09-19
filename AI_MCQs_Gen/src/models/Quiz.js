const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
