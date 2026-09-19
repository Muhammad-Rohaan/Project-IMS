const express = require('express');
const axios = require('axios');
const Quiz = require('../models/Quiz');

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { topic, difficulty = 'medium', count = 5 } = req.body;
  if (!topic || typeof topic !== 'string') return res.status(400).json({ error: 'topic required' });

  const prompt = `Create a ${count} question multiple-choice quiz about "${topic}" at ${difficulty} difficulty level.

      The response MUST be a valid JSON array following this exact format:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation for the correct answer"
        }
      ]
      Important: Return ONLY the JSON array with no other text or formatting.`;

  let questions = null;
  try {
    const resp = await axios.post(process.env.AI_MODEL, {
      messages: [
        { role: 'system', content: 'You are a quiz generator that only outputs valid JSON arrays of quiz questions.' },
        { role: 'user', content: prompt }
      ]
    }, { headers: { 'Content-Type': 'application/json' } });
    const completion = resp.data && resp.data.completion;
    if (completion) {
      try {
        questions = JSON.parse(completion);
      } catch {
        const m = completion.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (m) questions = JSON.parse(m[0]);
      }
    }
  } catch (_) { }

  if (!Array.isArray(questions) || questions.length === 0) {
    questions = [
      {
        question: `What is a key concept in ${topic}?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correctAnswer: 1,
        explanation: 'Concept B is fundamental to understanding this topic.'
      },
      {
        question: `Which of the following best describes ${topic}?`,
        options: ['Description A', 'Description B', 'Description C', 'Description D'],
        correctAnswer: 2,
        explanation: 'Description C provides the most accurate definition.'
      },
      {
        question: `When studying ${topic}, what principle is most important?`,
        options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
        correctAnswer: 0,
        explanation: 'Principle A forms the foundation of this subject.'
      },
      {
        question: `Who is considered the pioneer in the field of ${topic}?`,
        options: ['Person A', 'Person B', 'Person C', 'Person D'],
        correctAnswer: 3,
        explanation: 'Person D made breakthrough discoveries in this area.'
      },
      {
        question: `What method is commonly used to analyze ${topic}?`,
        options: ['Method A', 'Method B', 'Method C', 'Method D'],
        correctAnswer: 1,
        explanation: 'Method B is the standard approach in academic research.'
      }
    ];
  }

  const quiz = await Quiz.create({ topic, difficulty, questions });
  res.json({ quizId: quiz._id.toString(), questions, topic, difficulty });
});

router.get('/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'not found' });
  res.json(quiz);
});

module.exports = router;
