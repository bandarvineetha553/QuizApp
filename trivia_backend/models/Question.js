const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  category:     { type: Number, required: true },
  difficulty:   { type: String, required: true },
  question:     { type: String, required: true },
  correctIndex: { type: Number, required: true },
  options:      { type: [String], required: true }
});
module.exports = mongoose.model('Question', QuestionSchema);
