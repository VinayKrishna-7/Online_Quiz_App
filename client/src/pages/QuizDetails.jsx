import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, HelpCircle, Award, Target, ArrowLeft, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { quizAPI, attemptAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await quizAPI.getById(id);
        setQuiz(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load quiz details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  const handleStartQuiz = async () => {
    setStarting(true);
    try {
      const res = await attemptAPI.start(id);
      const { attemptId } = res.data.data;
      navigate(`/quiz/${id}/take?attemptId=${attemptId}`);
    } catch (err) {
      alert(`Could not start quiz: ${err.message}`);
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz details..." />;

  if (error || !quiz) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: 'var(--danger-text)', marginBottom: '0.75rem' }}>Quiz Not Found</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            {error || 'The requested quiz does not exist or has been removed.'}
          </p>
          <Link to="/quizzes" className="btn btn-primary">
            Back to Quiz Library
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions ? quiz.questions.length : 0;
  const totalMarks = quiz.questions
    ? quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    : totalQuestions;

  return (
    <div className="quiz-details-page animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="page-hero">
        <div className="container">
          <Link
            to="/quizzes"
            className="flex items-center gap-1"
            style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', width: 'fit-content' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Quizzes</span>
          </Link>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            {quiz.category || 'General'}
          </span>
          <h1>{quiz.title}</h1>
          <p>{quiz.description || 'Practice questions covering this topic.'}</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="text-xs text-muted font-semibold">QUESTIONS</div>
              <div className="font-bold text-lg">{totalQuestions} Items</div>
            </div>
          </div>

          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={22} />
            </div>
            <div>
              <div className="text-xs text-muted font-semibold">TIME LIMIT</div>
              <div className="font-bold text-lg">{quiz.durationMinutes} Minutes</div>
            </div>
          </div>

          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Award size={22} />
            </div>
            <div>
              <div className="text-xs text-muted font-semibold">TOTAL POINTS</div>
              <div className="font-bold text-lg">{totalMarks} Marks</div>
            </div>
          </div>

          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={22} />
            </div>
            <div>
              <div className="text-xs text-muted font-semibold">PASS SCORE</div>
              <div className="font-bold text-lg">{quiz.passPercentage || 40}%</div>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
            Instructions
          </h3>

          <div className="flex-col gap-3" style={{ display: 'flex' }}>
            <div className="flex items-start gap-3">
              <Clock size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <strong>Timers:</strong> The quiz has an overall countdown timer and each question has a 60-second timer to help you keep a steady pace.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <strong>Navigation:</strong> Questions are presented one at a time. You can move back and forth anytime before submitting.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <strong>Changing Answers:</strong> You can change your selected answer anytime before final submission.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <strong>Scoring:</strong> Correct answers receive 1 point each. There is no negative marking for incorrect or unanswered questions.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ShieldAlert size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'var(--warning-text)' }}>
                <strong>Automatic Submission:</strong> If the overall countdown timer reaches zero, your answers are submitted automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Start Action Bar */}
        <div className="card flex items-center justify-between" style={{ padding: '1.5rem' }}>
          <div>
            <div className="font-bold">Ready to start?</div>
            <div className="text-xs text-muted">Your timer begins once you click the button.</div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleStartQuiz}
            disabled={starting}
          >
            <Play size={18} fill="currentColor" />
            <span>{starting ? 'Starting...' : 'Start Quiz'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetails;
