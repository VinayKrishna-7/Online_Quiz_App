import { Link } from 'react-router-dom';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';
import './QuizCard.css';

function QuizCard({ quiz }) {
  const totalQuestions = quiz.questions ? quiz.questions.length : 0;
  const totalMarks = quiz.questions
    ? quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    : totalQuestions;

  return (
    <div className="card quiz-card flex-col justify-between">
      <div>
        <div className="quiz-card-top flex items-center justify-between">
          <span className="badge badge-primary">{quiz.category || 'General'}</span>
          <span className="quiz-card-points text-xs font-semibold text-muted">
            {totalMarks} marks
          </span>
        </div>

        <h3 className="quiz-card-title">{quiz.title}</h3>
        <p className="quiz-card-desc">
          {quiz.description || 'Practice questions covering this topic.'}
        </p>

        <div className="quiz-card-meta flex items-center gap-4">
          <div className="meta-item flex items-center gap-1">
            <HelpCircle size={15} />
            <span>{totalQuestions} Questions</span>
          </div>
          <div className="meta-item flex items-center gap-1">
            <Clock size={15} />
            <span>{quiz.durationMinutes} mins</span>
          </div>
        </div>
      </div>

      <div className="quiz-card-footer flex items-center justify-between">
        <Link to={`/quizzes/${quiz._id}`} className="btn btn-secondary btn-sm">
          Details
        </Link>
        <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary btn-sm">
          <span>Start Quiz</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default QuizCard;
