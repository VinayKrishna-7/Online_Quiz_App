import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';
import { attemptAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ReviewAnswers.css';

function ReviewAnswers() {
  const { attemptId } = useParams();

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await attemptAPI.getReview(attemptId);
        setReviewData(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load question review.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [attemptId]);

  if (loading) return <LoadingSpinner message="Loading review..." />;

  if (error || !reviewData) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <h3>Review Unavailable</h3>
          <p className="text-muted" style={{ margin: '0.75rem 0 1.5rem' }}>{error || 'Unable to access answer review.'}</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  const { quizTitle, quizId, questions = [], score, totalMarks, percentage, passed } = reviewData;

  return (
    <div className="review-page animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="page-hero">
        <div className="container">
          <Link
            to={`/result/${attemptId}`}
            className="flex items-center gap-1"
            style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', width: 'fit-content' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Result Summary</span>
          </Link>

          <h1>Answer Review: {quizTitle}</h1>
          <p>
            You scored {score}/{totalMarks} ({percentage}%). Review the correct answers and your selections below.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="review-list flex-col gap-4" style={{ display: 'flex' }}>
          {questions.map((q, qIndex) => {
            const isCorrect = q.isCorrect;
            const isAnswered = q.isAnswered;

            let cardBorder = 'var(--border)';
            if (isCorrect) cardBorder = 'var(--success-border)';
            else if (isAnswered) cardBorder = 'var(--danger-border)';

            return (
              <div
                key={q.questionId || qIndex}
                className="card review-card"
                style={{ borderColor: cardBorder }}
              >
                <div className="review-card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">Question {q.questionNumber}</span>
                    <span className="text-xs text-muted font-semibold">{q.points || 1} mark</span>
                  </div>

                  {isCorrect ? (
                    <span className="badge badge-success flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Correct (+{q.points || 1})</span>
                    </span>
                  ) : isAnswered ? (
                    <span className="badge badge-danger flex items-center gap-1">
                      <XCircle size={13} />
                      <span>Incorrect (0)</span>
                    </span>
                  ) : (
                    <span className="badge badge-warning flex items-center gap-1">
                      <HelpCircle size={13} />
                      <span>Unanswered (0)</span>
                    </span>
                  )}
                </div>

                <h3 className="review-question-text">{q.questionText}</h3>

                {/* 4 Options review */}
                <div className="review-options-list flex-col gap-2" style={{ display: 'flex' }}>
                  {q.options.map((optionText, optIndex) => {
                    const isUserSelection = q.selectedOption === optIndex;
                    const isCorrectAnswer = q.correctAnswer === optIndex;
                    const optionLetter = String.fromCharCode(65 + optIndex);

                    let itemClass = 'review-option-item flex items-center justify-between';
                    if (isCorrectAnswer) itemClass += ' option-item-correct';
                    if (isUserSelection && !isCorrectAnswer) itemClass += ' option-item-wrong';

                    return (
                      <div key={optIndex} className={itemClass}>
                        <div className="flex items-center gap-3">
                          <div className={`option-letter-badge ${isCorrectAnswer ? 'letter-correct' : isUserSelection ? 'letter-wrong' : ''}`}>
                            {optionLetter}
                          </div>
                          <span className="option-label-text">{optionText}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {isUserSelection && (
                            <span className="badge badge-primary">Your Choice</span>
                          )}
                          {isCorrectAnswer && (
                            <span className="badge badge-success flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              <span>Correct Answer</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="card flex items-center justify-between" style={{ padding: '1.5rem', marginTop: '2.5rem' }}>
          <Link to={`/result/${attemptId}`} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Back to Result</span>
          </Link>
          {quizId && (
            <Link to={`/quizzes/${quizId}`} className="btn btn-primary">
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewAnswers;
