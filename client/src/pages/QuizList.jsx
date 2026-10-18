import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { quizAPI } from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizAPI.getAll();
        setQuizzes(res.data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(quizzes.map((q) => q.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesCategory = selectedCategory === 'All' || quiz.category === selectedCategory;
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [quizzes, selectedCategory, searchQuery]);

  return (
    <div className="quiz-list-page animate-fade-in">
      <div className="page-hero">
        <div className="container">
          <h1>All Quizzes</h1>
          <p>
            Browse quizzes by topic or search for a specific title.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Search & Category Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search quiz title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Select Filter */}
            <div className="flex items-center gap-2" style={{ flex: '0 0 auto' }}>
              <Filter size={18} color="var(--text-muted)" />
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '160px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        {loading ? (
          <LoadingSpinner message="Fetching quizzes..." />
        ) : error ? (
          <div className="card text-center" style={{ padding: '3rem 1.5rem', color: 'var(--danger-text)' }}>
            <h3>Failed to load quizzes</h3>
            <p className="text-muted" style={{ margin: '0.5rem 0 1.5rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="card text-center" style={{ padding: '3.5rem 1.5rem' }}>
            <BookOpen size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3>No quizzes match your criteria</h3>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Try adjusting your search query or switching to another category.
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;
