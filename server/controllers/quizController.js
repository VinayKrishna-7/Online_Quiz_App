const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// Helper: strip correct answers from questions
const sanitizeQuiz = (quiz) => {
  const obj = quiz.toObject ? quiz.toObject() : quiz;
  return {
    ...obj,
    questions: obj.questions.map(({ questionText, options, points, timeLimitSeconds, _id }) => ({
      _id,
      questionText,
      options,
      points,
      timeLimitSeconds: timeLimitSeconds || 60,
    })),
  };
};

// GET /api/quizzes
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer').sort({ createdAt: -1 });
    res.json({ success: true, count: quizzes.length, data: quizzes });
  } catch (err) {
    next(err);
  }
};

// GET /api/quizzes/:id
exports.getQuizById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz ID format' });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // If admin query param is provided, return full quiz including correct answers for editing
    if (req.query.admin === 'true') {
      return res.json({ success: true, data: quiz });
    }

    res.json({ success: true, data: sanitizeQuiz(quiz) });
  } catch (err) {
    next(err);
  }
};

// POST /api/quizzes
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, durationMinutes, passPercentage, questions } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Quiz title is required' });
    }
    if (!durationMinutes || Number(durationMinutes) < 1) {
      return res.status(400).json({ success: false, message: 'Duration must be at least 1 minute' });
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one question is required' });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionText.trim()) {
        return res.status(400).json({ success: false, message: `Question ${i + 1} text is required` });
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ success: false, message: `Question ${i + 1} must have exactly 4 options` });
      }
      if (q.options.some((opt) => typeof opt !== 'string' || !opt.trim())) {
        return res.status(400).json({ success: false, message: `All 4 options for Question ${i + 1} must be non-empty` });
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer < 0 || q.correctAnswer > 3) {
        return res.status(400).json({ success: false, message: `Question ${i + 1} must have a valid correct answer (0-3)` });
      }
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      durationMinutes: Number(durationMinutes),
      passPercentage: passPercentage !== undefined ? Number(passPercentage) : 40,
      questions,
    });

    res.status(201).json({ success: true, data: quiz, message: 'Quiz created successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/quizzes/:id
exports.updateQuiz = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz ID format' });
    }

    const { title, description, category, durationMinutes, passPercentage, questions } = req.body;

    if (questions) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one question is required' });
      }
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText || !q.questionText.trim()) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} text is required` });
        }
        if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have exactly 4 options` });
        }
        if (q.options.some((opt) => typeof opt !== 'string' || !opt.trim())) {
          return res.status(400).json({ success: false, message: `All 4 options for Question ${i + 1} must be non-empty` });
        }
        if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer < 0 || q.correctAnswer > 3) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have a valid correct answer (0-3)` });
        }
      }
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(category && { category: category.trim() }),
        ...(durationMinutes && { durationMinutes: Number(durationMinutes) }),
        ...(passPercentage !== undefined && { passPercentage: Number(passPercentage) }),
        ...(questions && { questions }),
      },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, data: quiz, message: 'Quiz updated successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz ID format' });
    }

    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Also clean up any associated attempts
    await QuizAttempt.deleteMany({ quizId: req.params.id });

    res.json({ success: true, message: 'Quiz and associated attempts deleted successfully' });
  } catch (err) {
    next(err);
  }
};
