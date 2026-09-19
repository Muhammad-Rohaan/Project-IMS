const express = require('express');
const Result = require('../models/Result');

const router = express.Router();

router.post('/', async (req, res) => {
  const { quizId, userId, score, selectedAnswers } = req.body;
  if (!quizId || score === undefined || !selectedAnswers) return res.status(400).json({ error: 'invalid payload' });
  const result = await Result.create({ quizId, userId, score, selectedAnswers });
  res.json({ id: result._id.toString() });
});

router.get('/quiz/:quizId', async (req, res) => {
  const rows = await Result.find({ quizId: req.params.quizId }).sort({ createdAt: -1 });
  res.json(rows);
});

module.exports = router;
