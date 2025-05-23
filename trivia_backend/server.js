require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');

const Category = require('./models/Category');
const Question = require('./models/Question');

const app = express();
app.use(cors());
app.use(express.json());  // Parse JSON bodies

// Connect to MongoDB
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
  try {
    const cats = await Category.find().sort('id');
    res.json(cats);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// --- Step #2: Quiz Endpoint
app.get('/api/quiz', async (req, res) => {
  try {
    const { category, difficulty, amount } = req.query;
    const num = parseInt(amount, 10) || 5;
    const qs = await Question.aggregate([
      { $match: { category: +category, difficulty } },
      { $sample: { size: num } }
    ]);
    res.json(qs);
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    res.status(500).json({ error: 'Failed to load quiz questions' });
  }
});

// --- Step #3: Scoring Endpoint
app.post('/api/quiz/score', async (req, res) => {
  console.log('Received /api/quiz/score:', req.body);
  try {
    const { answers } = req.body;
    // Validate payload is an object map, not an array
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      console.error('Invalid answers payload:', req.body);
      return res.status(400).json({ error: 'Bad payload: answers must be an object map' });
    }

    // Extract IDs and fetch questions
    const ids = Object.keys(answers);
    if (ids.length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    const questions = await Question.find({ id: { $in: ids } }).lean();

    // Score and build details
    let score = 0;
    const details = questions.map(q => {
      const selected = answers[q.id];
      const correct = selected === q.correctIndex;
      if (correct) score++;
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        selected,
        correctIndex: q.correctIndex,
        correct
      };
    });

    // Return score result
    res.json({ score, total: ids.length, details });
  } catch (err) {
    console.error('Error in /api/quiz/score:', err);
    res.status(500).json({ error: err.message || 'Server error during scoring' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
