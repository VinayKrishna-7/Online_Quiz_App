import { CheckCircle2 } from 'lucide-react';
import './QuestionNavigation.css';

function QuestionNavigation({
  questions = [],
  currentIndex = 0,
  answers = {},
  onSelectQuestion,
}) {
  return (
    <div className="card qnav-card">
      <div className="qnav-header flex items-center justify-between">
        <h4 className="qnav-title">Questions</h4>
        <span className="text-xs text-muted font-semibold">
          {Object.keys(answers).filter((k) => answers[k] !== null && answers[k] !== undefined).length}/{questions.length} Answered
        </span>
      </div>

      <div className="qnav-grid">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id] !== null && answers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;

          let btnClass = 'qnav-btn';
          if (isCurrent) btnClass += ' qnav-btn-current';
          else if (isAnswered) btnClass += ' qnav-btn-answered';
          else btnClass += ' qnav-btn-unanswered';

          return (
            <button
              key={q._id || idx}
              type="button"
              className={btnClass}
              onClick={() => onSelectQuestion(idx)}
              aria-label={`Jump to question ${idx + 1}`}
            >
              <span>{idx + 1}</span>
              {isAnswered && !isCurrent && (
                <CheckCircle2 size={10} className="qnav-check-icon" />
              )}
            </button>
          );
        })}
      </div>

      <div className="qnav-legend flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-1">
          <span className="legend-indicator legend-current" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="legend-indicator legend-answered" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="legend-indicator legend-unanswered" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionNavigation;
