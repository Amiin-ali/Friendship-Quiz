import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyQuizzes from './pages/MyQuizzes';
import QuizBuilder from './pages/QuizBuilder';
import QuizParticipation from './pages/QuizParticipation';
import QuizResults from './pages/QuizResults';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] -z-10 animate-blob pointer-events-none"></div>
        
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz/:slug" element={<QuizParticipation />} />
            <Route path="/quiz/:slug/results" element={<QuizResults />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-quizzes" element={
              <ProtectedRoute>
                <MyQuizzes />
              </ProtectedRoute>
            } />
            <Route path="/create-quiz" element={
              <ProtectedRoute>
                <QuizBuilder />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} />
      </div>
    </Router>
  );
}

export default App;
