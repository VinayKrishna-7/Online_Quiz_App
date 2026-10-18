import { Link } from 'react-router-dom';
import { HelpCircle, Home, BookOpen } from 'lucide-react';

function NotFound() {
  return (
    <div className="container flex-col items-center justify-center animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <HelpCircle size={40} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 2rem' }}>
        The quiz or page you requested could not be found. It might have been moved or does not exist.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn btn-primary">
          <Home size={16} />
          <span>Go to Home</span>
        </Link>
        <Link to="/quizzes" className="btn btn-secondary">
          <BookOpen size={16} />
          <span>Browse Quizzes</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
