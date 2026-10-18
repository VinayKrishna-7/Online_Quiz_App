import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Plus } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('qm_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isStudioActive = location.pathname.startsWith('/admin') || location.pathname.startsWith('/studio');

  return (
    <header className="navbar">
      <div className="container flex items-center justify-between navbar-inner">
        <Link to="/" className="navbar-brand flex items-center gap-2">
          <div className="brand-logo-icon">
            <GraduationCap size={22} />
          </div>
          <span className="brand-title">QuizMaster</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="navbar-links flex items-center gap-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}>
              Quizzes
            </Link>
            <Link to="/studio" className={`nav-link ${isStudioActive && !location.pathname.includes('/create') ? 'active' : ''}`}>
              Quiz Studio
            </Link>
          </nav>

          <Link to="/admin/create" className="btn btn-primary btn-sm flex items-center gap-1 nav-create-btn">
            <Plus size={15} />
            <span>Create Quiz</span>
          </Link>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
