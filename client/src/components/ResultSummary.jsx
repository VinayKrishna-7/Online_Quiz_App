import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

function ResultSummary({ result }) {
  if (!result) return null;

  const {
    quizTitle,
    totalQuestions,
    correctCount = 0,
    incorrectCount = 0,
    unansweredCount = 0,
    totalMarks,
    score,
    percentage,
    passed,
    passPercentage = 40,
  } = result;

  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span
          className={`badge ${passed ? 'badge-success' : 'badge-danger'}`}
          style={{ fontSize: '0.875rem', padding: '0.35rem 0.85rem' }}
        >
          {passed ? 'Passed' : 'Did Not Pass'}
        </span>
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
        {quizTitle}
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
        {passed
          ? `You achieved a passing score of ${percentage}%. The passing threshold is ${passPercentage}%.`
          : `You scored ${percentage}%. The passing threshold is ${passPercentage}%.`}
      </p>

      {/* Results Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '1.25rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Final Score
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '1.25rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {score} / {totalMarks}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Marks Obtained
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--success-light)',
          padding: '1.25rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--success-border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--success-text)',
          }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <span>{correctCount}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--success-text)', fontWeight: 600 }}>
            Correct
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--danger-light)',
          padding: '1.25rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--danger-border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--danger-text)',
          }}>
            <XCircle size={20} color="var(--danger)" />
            <span>{incorrectCount}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--danger-text)', fontWeight: 600 }}>
            Incorrect
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '1.25rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
          }}>
            <HelpCircle size={20} />
            <span>{unansweredCount}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Unanswered
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultSummary;
