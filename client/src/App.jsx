import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import QuizDetails from './pages/QuizDetails';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import ReviewAnswers from './pages/ReviewAnswers';
import AdminDashboard from './pages/AdminDashboard';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizDetails />} />
            <Route path="/quiz/:id/take" element={<TakeQuiz />} />
            <Route path="/result/:attemptId" element={<QuizResult />} />
            <Route path="/review/:attemptId" element={<ReviewAnswers />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<CreateQuiz />} />
            <Route path="/admin/edit/:id" element={<EditQuiz />} />
            <Route path="/studio" element={<AdminDashboard />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
