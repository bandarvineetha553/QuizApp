require('dotenv').config();
const mongoose = require('mongoose');
const axios    = require('axios');
const Category = require('../models/Category');
const Question = require('../models/Question');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Fetch & store categories
  const { data: { trivia_categories }} = await axios.get('https://opentdb.com/api_category.php');
  await Category.deleteMany({});
  await Category.insertMany(trivia_categories);

  // 2. Fetch questions for each category/difficulty and save
  await Question.deleteMany({});
  const difficulties = ['easy','medium','hard'];
  for (let cat of trivia_categories) {
    for (let diff of difficulties) {
      const res = await axios.get('https://opentdb.com/api.php', {
        params: { amount: 5, category: cat.id, difficulty: diff, type: 'multiple' }
      });
      for (let item of res.data.results) {
        // combine correct & incorrect answers, randomize
        const opts = [...item.incorrect_answers];
        const correctIndex = Math.floor(Math.random() * (opts.length + 1));
        opts.splice(correctIndex, 0, item.correct_answer);

        await new Question({
          id:           item.question + '-' + cat.id + '-' + diff,
          category:     cat.id,
          difficulty:   diff,
          question:     item.question,
          correctIndex,
          options:      opts
        }).save();
      }
    }
  }

  console.log('✅ Seeding complete');
  mongoose.disconnect();
}

seed();
