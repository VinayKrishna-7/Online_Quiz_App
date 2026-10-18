import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Clock, Award, HelpCircle, Play } from 'lucide-react';
import { quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast, ToastContainer } from '../components/ToastNotification';

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const fetchQuizzes = async () => {
    try {
      const res = await quizAPI.getAll();
      setQuizzes(res.data.data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch quizzes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    setDeleting(true);

    try {
      await quizAPI.delete(quizToDelete._id);
      addToast(`"${quizToDelete.title}" deleted successfully.`, 'success');
      setQuizzes((prev) => prev.filter((q) => q._id !== quizToDelete._id));
      setQuizToDelete(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete quiz.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
  const totalCategories = new Set(quizzes.map((q) => q.category).filter(Boolean)).size;

  return (
    <div className="admin-page animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="page-hero">
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1>Quiz Creator Studio</h1>
            <p>
              Create, edit, preview, and manage your custom quizzes.
            </p>
          </div>
          <Link to="/admin/create" className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Quiz</span>
          </Link>
        </div>
      </div>

      <div className="container">
        {/* Creator Studio Quick Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{quizzes.length}</div>
              <div className="text-xs text-muted font-medium">Total Quizzes</div>
            </div>
          </div>

          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalQuestions}</div>
              <div className="text-xs text-muted font-medium">Questions Authored</div>
            </div>
          </div>

          <div className="card flex items-center gap-3" style={{ padding: '1.25rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalCategories}</div>
              <div className="text-xs text-muted font-medium">Topics & Categories</div>
            </div>
          </div>
        </div>

        {/* Quizzes Table Card */}
        {loading ? (
          <LoadingSpinner message="Loading quiz studio catalog..." />
        ) : quizzes.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <BookOpen size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3>No quizzes created yet</h3>
            <p className="text-muted" style={{ margin: '0.5rem 0 1.5rem' }}>
              Create your first custom quiz with multiple-choice questions, timers, and scoring.
            </p>
            <Link to="/admin/create" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Your First Quiz</span>
            </Link>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                  }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Quiz Title</th>
                    <th style={{ padding: '1rem 1rem' }}>Category</th>
                    <th style={{ padding: '1rem 1rem' }}>Questions</th>
                    <th style={{ padding: '1rem 1rem' }}>Duration</th>
                    <th style={{ padding: '1rem 1rem' }}>Passing Score</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr
                      key={quiz._id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div className="font-bold" style={{ color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                          {quiz.title}
                        </div>
                        <div className="text-xs text-muted" style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {quiz.description || 'No description provided'}
                        </div>
                      </td>

                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span className="badge badge-primary">{quiz.category || 'General'}</span>
                      </td>

                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <HelpCircle size={15} color="var(--text-muted)" />
                          <span>{quiz.questions ? quiz.questions.length : 0}</span>
                        </div>
                      </td>

                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div className="flex items-center gap-1 text-sm text-muted">
                          <Clock size={15} />
                          <span>{quiz.durationMinutes} min</span>
                        </div>
                      </td>

                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span className="badge badge-success">{quiz.passPercentage || 40}%</span>
                      </td>

                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2" style={{ display: 'inline-flex' }}>
                          <Link
                            to={`/quizzes/${quiz._id}`}
                            className="btn btn-ghost btn-sm"
                            title="Preview Quiz"
                          >
                            <Play size={13} />
                            <span>Preview</span>
                          </Link>
                          <Link
                            to={`/admin/edit/${quiz._id}`}
                            className="btn btn-secondary btn-sm"
                            title="Edit Quiz"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setQuizToDelete(quiz)}
                            title="Delete Quiz"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(quizToDelete)}
        title="Delete Quiz?"
        message={`Are you sure you want to delete "${quizToDelete?.title}"? All existing attempts for this quiz will also be removed. This action cannot be reversed.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Quiz'}
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  );
}

export default AdminDashboard;
