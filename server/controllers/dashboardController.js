const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalQuizzes, totalAttempts, submittedAttempts] = await Promise.all([
      Quiz.countDocuments(),
      QuizAttempt.countDocuments(),
      QuizAttempt.countDocuments({ status: { $in: ['submitted', 'expired'] } }),
    ]);

    res.json({
      success: true,
      data: {
        totalQuizzes,
        totalAttempts,
        submittedAttempts,
      },
    });
  } catch (err) {
    next(err);
  }
};
