import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';
import { quizAPI, attemptAPI } from '../services/api';
import QuizTimer from '../components/QuizTimer';
import QuestionTimer from '../components/QuestionTimer';
import ProgressBar from '../components/ProgressBar';
import QuestionNavigation from '../components/QuestionNavigation';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './TakeQuiz.css';

function TakeQuiz() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Answers map: { [questionId]: selectedOptionIndex (0-3) | null }
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');

  // Lock to avoid duplicate submissions on timeout vs manual click
  const submissionLock = useRef(false);

  // Load quiz and attempt info
  useEffect(() => {
    if (!attemptId) {
      navigate(`/quizzes/${id}`);
      return;
    }

    const loadQuizAndAttempt = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          quizAPI.getById(id),
          attemptAPI.get(attemptId),
        ]);

        const quizData = quizRes.data.data;
        const attemptData = attemptRes.data.data;

        // If attempt is already submitted or expired, navigate to result
        if (attemptData.status === 'submitted' || attemptData.status === 'expired') {
          navigate(`/result/${attemptId}`);
          return;
        }

        setQuiz(quizData);
        setAttempt(attemptData);

        // Prepopulate answers from attempt if existing
        const initialAnswers = {};
        if (attemptData.answers && Array.isArray(attemptData.answers)) {
          attemptData.answers.forEach((ans) => {
            initialAnswers[ans.questionId] = ans.selectedOption;
          });
        }
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message || 'Could not load quiz attempt session.');
      } finally {
        setLoading(false);
      }
    };

    loadQuizAndAttempt();
  }, [id, attemptId, navigate]);

  // Handle option selection
  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit attempt payload
  const doSubmit = useCallback(async (isAutoSubmit = false) => {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Build answers array matching the server model
      const formattedAnswers = quiz.questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] !== undefined ? answers[q._id] : null,
      }));

      await attemptAPI.submit(attemptId, formattedAnswers);
      navigate(`/result/${attemptId}`);
    } catch (err) {
      // If server returned 409 (already submitted), just navigate to result
      if (err.message.includes('already been submitted')) {
        navigate(`/result/${attemptId}`);
      } else {
        setError(err.message || 'Failed to submit quiz attempt.');
        setSubmitting(false);
        submissionLock.current = false;
      }
    }
  }, [quiz, answers, attemptId, navigate]);

  // Auto-submit when countdown hits zero
  const handleTimerExpire = useCallback(() => {
    if (!submissionLock.current) {
      doSubmit(true);
    }
  }, [doSubmit]);

  // Auto-advance when individual question timer expires
  const handleQuestionTimeout = useCallback((qIndex) => {
    if (!quiz) return;
    if (qIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [quiz]);

  if (loading) return <LoadingSpinner message="Loading quiz..." />;

  if (error || !quiz || !attempt) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h3>Unable to Load Quiz</h3>
          <p className="text-muted" style={{ margin: '0.75rem 0 1.5rem' }}>
            {error || 'Unable to connect to quiz attempt.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.values(answers).filter((val) => val !== null && val !== undefined).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="take-quiz-page animate-fade-in">
      {/* Top Fixed Quiz Header Bar */}
      <header className="take-quiz-header">
        <div className="container flex items-center justify-between" style={{ height: '70px' }}>
          <div className="flex items-center gap-3">
            <h2 className="quiz-title-header">{quiz.title}</h2>
            <span className="badge badge-primary text-xs" style={{ display: 'none' }}>
              {quiz.category}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <QuizTimer
              expiresAt={attempt.expiresAt}
              onExpire={handleTimerExpire}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setShowConfirmModal(true)}
              disabled={submitting}
            >
              <Send size={15} />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="container" style={{ paddingBottom: '0.5rem' }}>
          <ProgressBar current={currentIndex + 1} total={totalQuestions} showLabel={false} />
        </div>
      </header>

      {/* Main Examination Body */}
      <div className="container take-quiz-content">
        <div className="quiz-stage-layout">
          {/* Main Question Display Card */}
          <main className="question-stage">
            <div className="card question-card">
              <div className="question-card-header flex items-center justify-between">
                <span className="badge badge-primary">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs text-muted font-semibold">
                  {currentQuestion.points || 1} mark
                </span>
              </div>

              {/* Per-Question Live Countdown Timer */}
              <QuestionTimer
                questionIndex={currentIndex}
                durationSeconds={currentQuestion.timeLimitSeconds || 60}
                onTimeout={handleQuestionTimeout}
              />

              <div className="question-body">
                <h3 className="question-text">{currentQuestion.questionText}</h3>

                {/* 4 Options */}
                <div className="options-container flex-col gap-3">
                  {currentQuestion.options.map((optionText, optIndex) => {
                    const isSelected = answers[currentQuestion._id] === optIndex;
                    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        className={`option-card flex items-center gap-3 ${isSelected ? 'option-selected' : ''}`}
                        onClick={() => handleSelectOption(currentQuestion._id, optIndex)}
                        disabled={submitting}
                      >
                        <div className={`option-letter-box ${isSelected ? 'letter-selected' : ''}`}>
                          {optionLetter}
                        </div>
                        <span className="option-text">{optionText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="question-card-footer flex items-center justify-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  disabled={currentIndex === 0 || submitting}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-muted font-semibold">
                  {answers[currentQuestion._id] !== null && answers[currentQuestion._id] !== undefined ? (
                    <span style={{ color: 'var(--success)' }}>✓ Answer Recorded</span>
                  ) : (
                    <span>Not Answered Yet</span>
                  )}
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}
                    disabled={submitting}
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={submitting}
                  >
                    <Send size={15} />
                    <span>Review & Submit</span>
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Sidebar: Navigation Palette */}
          <aside className="quiz-sidebar">
            <QuestionNavigation
              questions={quiz.questions}
              currentIndex={currentIndex}
              answers={answers}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
            />

            {unansweredCount > 0 && (
              <div
                className="card flex items-center gap-2"
                style={{
                  padding: '0.875rem 1rem',
                  marginTop: '1rem',
                  backgroundColor: 'var(--warning-light)',
                  border: '1px solid var(--warning-border)',
                  color: 'var(--warning-text)',
                  fontSize: '0.8125rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>{unansweredCount}</strong> question{unansweredCount > 1 ? 's' : ''} left unanswered.
                </span>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Submit Quiz Attempt?"
        message={
          unansweredCount > 0
            ? `You have answered ${answeredCount} out of ${totalQuestions} questions. You still have ${unansweredCount} unanswered question(s). Unanswered questions will receive 0 marks. Do you want to submit now?`
            : `You have answered all ${totalQuestions} questions! Are you ready to submit your assessment and see your results?`
        }
        confirmText={submitting ? 'Submitting...' : 'Yes, Submit Final'}
        cancelText="Keep Answering"
        confirmVariant="primary"
        onConfirm={() => doSubmit(false)}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export default TakeQuiz;
