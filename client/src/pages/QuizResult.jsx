import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, RotateCcw, Eye, BookOpen, AlertCircle } from 'lucide-react';
import { attemptAPI } from '../services/api';
import ResultSummary from '../components/ResultSummary';
import LoadingSpinner from '../components/LoadingSpinner';

function QuizResult() {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await attemptAPI.getResult(attemptId);
        setResult(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve attempt result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) return <LoadingSpinner message="Loading results..." />;

  if (error || !result) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h3>Result Not Available</h3>
          <p className="text-muted" style={{ margin: '0.75rem 0 1.5rem' }}>
            {error || 'This attempt might not have been submitted or does not exist.'}
          </p>
          <Link to="/quizzes" className="btn btn-primary">
            Browse Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-result-page animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Result Summary Card Component */}
        <ResultSummary result={result} />

        {/* Action Controls */}
        <div className="card flex items-center justify-between" style={{ padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to={`/review/${attemptId}`} className="btn btn-secondary">
              <Eye size={16} />
              <span>Review Answers</span>
            </Link>

            <Link to={`/quizzes/${result.quizId}`} className="btn btn-primary">
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
