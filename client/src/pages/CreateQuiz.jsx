import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, HelpCircle, AlertCircle } from 'lucide-react';
import { quizAPI } from '../services/api';
import { useToast, ToastContainer } from '../components/ToastNotification';
import './QuizForm.css';

const createEmptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  points: 1,
  timeLimitSeconds: 60,
});

function CreateQuiz() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    durationMinutes: 10,
    passPercentage: 40,
    questions: [createEmptyQuestion()],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Field updates
  const handleMetaChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];
      updatedOptions[optIndex] = value;
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()],
    }));
  };

  const removeQuestion = (qIndex) => {
    if (formData.questions.length <= 1) {
      addToast('A quiz must contain at least one question.', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIndex),
    }));
  };

  // Comprehensive Frontend Validation
  const validate = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Quiz title is required.';
    }
    if (!formData.durationMinutes || formData.durationMinutes < 1) {
      errs.durationMinutes = 'Duration must be at least 1 minute.';
    }
    if (formData.passPercentage < 0 || formData.passPercentage > 100) {
      errs.passPercentage = 'Pass percentage must be between 0 and 100.';
    }
    if (!formData.questions || formData.questions.length === 0) {
      errs.questions = 'At least one question is required.';
    }

    formData.questions.forEach((q, qIdx) => {
      if (!q.questionText.trim()) {
        errs[`q_${qIdx}_text`] = `Question ${qIdx + 1} text is required.`;
      }
      q.options.forEach((opt, optIdx) => {
        if (!opt.trim()) {
          errs[`q_${qIdx}_opt_${optIdx}`] = `Option ${String.fromCharCode(65 + optIdx)} cannot be empty.`;
        }
      });
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please complete all required fields properly.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await quizAPI.create(formData);
      addToast('Quiz published successfully!', 'success');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      addToast(err.message || 'Failed to create quiz.', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="quiz-form-page animate-fade-in" style={{ paddingBottom: '6rem' }}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="page-hero">
        <div className="container">
          <Link
            to="/studio"
            className="flex items-center gap-1"
            style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', width: 'fit-content' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Quiz Studio</span>
          </Link>
          <h1>Create Your Own Quiz</h1>
          <p>
            Write custom questions, set options and answer keys, and configure timers.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px' }}>
        <form onSubmit={handleSubmit}>
          {/* Metadata Card */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Quiz Information
            </h3>

            <div className="form-group">
              <label className="form-label">Quiz Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Node.js & Express Fundamentals"
                value={formData.title}
                onChange={(e) => handleMetaChange('title', e.target.value)}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detailed description of topics covered in this quiz..."
                value={formData.description}
                onChange={(e) => handleMetaChange('description', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Programming, Web Dev"
                  value={formData.category}
                  onChange={(e) => handleMetaChange('category', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Minutes) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.durationMinutes}
                  onChange={(e) => handleMetaChange('durationMinutes', Number(e.target.value))}
                />
                {errors.durationMinutes && <div className="form-error">{errors.durationMinutes}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Pass Benchmark (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  value={formData.passPercentage}
                  onChange={(e) => handleMetaChange('passPercentage', Number(e.target.value))}
                />
                {errors.passPercentage && <div className="form-error">{errors.passPercentage}</div>}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>2. Questions ({formData.questions.length})</h3>
                <p className="text-xs text-muted">Each question requires 4 distinct choices and 1 selected correct answer.</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addQuestion}
              >
                <Plus size={15} />
                <span>Add Question</span>
              </button>
            </div>

            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              {formData.questions.map((question, qIdx) => (
                <div key={qIdx} className="card question-editor-card">
                  <div className="question-editor-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-primary">Question #{qIdx + 1}</span>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <span>Timer (sec):</span>
                        <input
                          type="number"
                          min="5"
                          max="600"
                          className="form-input"
                          style={{ width: '80px', padding: '0.2rem 0.5rem', fontSize: '0.8125rem' }}
                          value={question.timeLimitSeconds || 60}
                          onChange={(e) => handleQuestionChange(qIdx, 'timeLimitSeconds', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeQuestion(qIdx)}
                      title="Remove Question"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Question Text *</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder={`Enter question text for #${qIdx + 1}...`}
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    />
                    {errors[`q_${qIdx}_text`] && (
                      <div className="form-error">{errors[`q_${qIdx}_text`]}</div>
                    )}
                  </div>

                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Answer Options (Select the radio of the correct answer) *
                  </label>

                  <div className="flex-col gap-2" style={{ display: 'flex' }}>
                    {question.options.map((option, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = question.correctAnswer === optIdx;

                      return (
                        <div key={optIdx} className={`option-edit-row flex items-center gap-3 ${isCorrect ? 'correct-option-row' : ''}`}>
                          <label className="correct-radio-label" title="Mark as correct answer">
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={isCorrect}
                              onChange={() => handleQuestionChange(qIdx, 'correctAnswer', optIdx)}
                            />
                            <span className="radio-letter">{letter}</span>
                          </label>

                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder={`Option ${letter} text...`}
                              value={option}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            />
                            {errors[`q_${qIdx}_opt_${optIdx}`] && (
                              <div className="form-error">{errors[`q_${qIdx}_opt_${optIdx}`]}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addQuestion}
              >
                <Plus size={16} />
                <span>Add Another Question</span>
              </button>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="card flex items-center justify-between" style={{ padding: '1.5rem' }}>
            <Link to="/studio" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Publishing Quiz...' : 'Publish Quiz'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;
