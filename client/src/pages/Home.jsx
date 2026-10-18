import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import { quizAPI } from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizAPI.getAll();
        setQuizzes(res.data.data || []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const categories = ['All', ...new Set(quizzes.map((q) => q.category).filter(Boolean))];

  const filteredQuizzes = selectedCategory === 'All'
    ? quizzes
    : quizzes.filter((q) => q.category === selectedCategory);

  return (
    <div className="home-page">
      {/* Human-built clean Header Section */}
      <section className="home-header-section">
        <div className="container">
          <div className="home-header-content">
            <h1 className="home-title">Practice & Test Your Knowledge</h1>
            <p className="home-subtitle">
              Take free quizzes in programming, web development, and general topics. Review your answers and track your score.
            </p>
            <div className="home-actions flex items-center gap-2">
              <Link to="/quizzes" className="btn btn-primary">
                Browse All Quizzes
              </Link>
              <Link to="/admin/create" className="btn btn-secondary">
                <Plus size={16} />
                <span>Create a Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Quizzes List */}
      <section className="container home-quizzes-section">
        <div className="quizzes-toolbar flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Available Quizzes</h2>
            <span className="text-xs text-muted">Select any quiz to get started</span>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-pills flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading quizzes..." />
        ) : filteredQuizzes.length === 0 ? (
          <div className="card text-center" style={{ padding: '3.5rem 1.5rem' }}>
            <BookOpen size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3>No quizzes found</h3>
            <p className="text-muted" style={{ margin: '0.5rem 0 1.5rem' }}>
              No quizzes available in this category yet.
            </p>
            <Link to="/admin/create" className="btn btn-primary">
              Create a Quiz
            </Link>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>

      {/* Create Your Own Quiz Banner */}
      <section className="container" style={{ padding: '1rem 1.5rem 4rem' }}>
        <div className="card flex items-center justify-between" style={{ padding: '2rem 2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
              Want to create your own quiz?
            </h2>
            <p className="text-muted" style={{ margin: 0, maxWidth: '580px', fontSize: '0.9375rem' }}>
              Design custom questions, set per-question timers, choose correct answers, and test your students or team.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/studio" className="btn btn-secondary">
              Open Quiz Studio
            </Link>
            <Link to="/admin/create" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Quiz</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
