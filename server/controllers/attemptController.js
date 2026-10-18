const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// POST /api/attempts/start
exports.startAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.body;
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ success: false, message: 'Valid quiz ID is required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const startedAt = new Date();
    // Expiration calculated strictly from server time
    const expiresAt = new Date(startedAt.getTime() + quiz.durationMinutes * 60 * 1000);

    // Initialize blank answers for all questions
    const answers = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedOption: null,
    }));

    const attempt = await QuizAttempt.create({
      quizId,
      answers,
      startedAt,
      expiresAt,
      status: 'in_progress',
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started',
      data: {
        attemptId: attempt._id,
        quizId,
        startedAt,
        expiresAt,
        durationMinutes: quiz.durationMinutes,
        totalQuestions: quiz.questions.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/attempts/:attemptId
exports.getAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ success: false, message: 'Invalid attempt ID format' });
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    const now = new Date();
    const remainingMs = Math.max(0, new Date(attempt.expiresAt).getTime() - now.getTime());
    const isExpired = remainingMs === 0;

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        quizId: attempt.quizId,
        answers: attempt.answers,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        remainingMs,
        isExpired,
        status: attempt.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/attempts/:attemptId/submit
exports.submitAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ success: false, message: 'Invalid attempt ID format' });
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Duplicate submission prevention
    if (attempt.status === 'submitted') {
      return res.status(409).json({ success: false, message: 'This attempt has already been submitted' });
    }

    const now = new Date();
    // Allow a small grace period (30s) for network latency after expiration
    const gracePeriodMs = 30 * 1000;
    const isBeyondGrace = (now.getTime() - new Date(attempt.expiresAt).getTime()) > gracePeriodMs;

    const { answers: submittedAnswers } = req.body;

    // Merge answers if submitted (unless wildly beyond expiration)
    if (submittedAnswers && Array.isArray(submittedAnswers)) {
      submittedAnswers.forEach((subAns) => {
        if (!subAns.questionId || !mongoose.Types.ObjectId.isValid(subAns.questionId)) return;
        const target = attempt.answers.find(
          (a) => a.questionId.toString() === subAns.questionId.toString()
        );
        if (target) {
          const sel = subAns.selectedOption;
          if (sel === null || (Number.isInteger(sel) && sel >= 0 && sel <= 3)) {
            target.selectedOption = sel;
          }
        }
      });
    }

    // Retrieve quiz with authoritative correct answers
    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Associated quiz not found' });
    }

    // Server-side authoritative evaluation
    let score = 0;
    let totalMarks = 0;

    quiz.questions.forEach((q) => {
      const qPoints = q.points || 1;
      totalMarks += qPoints;

      const userAns = attempt.answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );
      if (userAns && userAns.selectedOption !== null && userAns.selectedOption === q.correctAnswer) {
        score += qPoints;
      }
    });

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percentage >= (quiz.passPercentage || 40);

    attempt.score = score;
    attempt.totalMarks = totalMarks;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.status = isBeyondGrace ? 'expired' : 'submitted';
    attempt.submittedAt = now;

    await attempt.save();

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attemptId: attempt._id,
        quizId: attempt.quizId,
        quizTitle: quiz.title,
        score,
        totalMarks,
        percentage,
        passed,
        passPercentage: quiz.passPercentage || 40,
        totalQuestions: quiz.questions.length,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/attempts/:attemptId/result
exports.getResult = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ success: false, message: 'Invalid attempt ID format' });
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.status !== 'submitted' && attempt.status !== 'expired') {
      return res.status(400).json({ success: false, message: 'Attempt has not been submitted yet' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Associated quiz not found' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    quiz.questions.forEach((q) => {
      const userAns = attempt.answers.find((a) => a.questionId.toString() === q._id.toString());
      if (!userAns || userAns.selectedOption === null || userAns.selectedOption === undefined) {
        unansweredCount++;
      } else if (userAns.selectedOption === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        quizId: attempt.quizId,
        quizTitle: quiz.title,
        category: quiz.category,
        totalQuestions: quiz.questions.length,
        answeredCount: correctCount + incorrectCount,
        unansweredCount,
        correctCount,
        incorrectCount,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        passPercentage: quiz.passPercentage || 40,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/attempts/:attemptId/review
exports.getReview = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ success: false, message: 'Invalid attempt ID format' });
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.status !== 'submitted' && attempt.status !== 'expired') {
      return res.status(400).json({ success: false, message: 'Attempt has not been submitted yet' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Associated quiz not found' });
    }

    const reviewQuestions = quiz.questions.map((q, index) => {
      const userAns = attempt.answers.find((a) => a.questionId.toString() === q._id.toString());
      const selected = userAns ? userAns.selectedOption : null;
      const isAnswered = selected !== null && selected !== undefined;
      const isCorrect = isAnswered && selected === q.correctAnswer;

      return {
        questionNumber: index + 1,
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: selected,
        isCorrect,
        isAnswered,
        points: q.points || 1,
      };
    });

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        quizId: attempt.quizId,
        quizTitle: quiz.title,
        category: quiz.category,
        questions: reviewQuestions,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        passPercentage: quiz.passPercentage || 40,
      },
    });
  } catch (err) {
    next(err);
  }
};
