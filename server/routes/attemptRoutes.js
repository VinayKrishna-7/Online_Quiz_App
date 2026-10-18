const express = require('express');
const router = express.Router();
const {
  startAttempt,
  getAttempt,
  submitAttempt,
  getResult,
  getReview,
} = require('../controllers/attemptController');

router.post('/start', startAttempt);
router.get('/:attemptId', getAttempt);
router.post('/:attemptId/submit', submitAttempt);
router.get('/:attemptId/result', getResult);
router.get('/:attemptId/review', getReview);

module.exports = router;
