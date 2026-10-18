const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 4 && arr.every((o) => typeof o === 'string' && o.trim().length > 0);
      },
      message: 'Each question must have exactly 4 non-empty options',
    },
    required: true,
  },
  correctAnswer: {
    type: Number,
    min: 0,
    max: 3,
    required: [true, 'Correct answer index is required (0-3)'],
  },
  points: {
    type: Number,
    default: 1,
    min: 0,
  },
  timeLimitSeconds: {
    type: Number,
    default: 60,
    min: [5, 'Question time limit must be at least 5 seconds'],
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    passPercentage: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'A quiz must contain at least one question',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
