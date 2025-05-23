require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');

const Category = require('./models/Category');
const Question = require('./models/Question');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// --- Step #1: Categories Endpoint
app.get('/api/categories', async (req, res) => {
  const cats = await Category.find().sort('id');
  res.json(cats);
});

// --- Step #2: Quiz Endpoint
app.get('/api/quiz', async (req, res) => {
  const { category, difficulty, amount } = req.query;
    const num = parseInt(amount, 10) || 5;
  const qs = await Question.aggregate([
    { $match: { category: +category, difficulty }},
    { $sample: { size: +num }}
  ]);
  res.json(qs);
});

// --- Step #3: Scoring Endpoint
app.post('/api/quiz/score', async (req, res) => {
  const { answers } = req.body; // [{ id, answer }]
  const details = [];
  let score = 0;

  for (let { id, answer } of answers) {
    const q = await Question.findOne({ id });
    const correct = q.correctIndex === answer;
    if (correct) score++;
    details.push({
      id,
      question:     q.question,
      options:      q.options,
      selected:     answer,
      correctIndex: q.correctIndex,
      correct
    });
  }

  res.json({
    score,
    total:   answers.length,
    details
  });
});
//server.js


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
