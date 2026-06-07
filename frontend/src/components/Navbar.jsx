import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary-400" />
              <span className="font-heading font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                KnowMe
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/my-quizzes" className="text-slate-300 hover:text-white transition-colors">My Quizzes</Link>
                  <Link to="/create-quiz" className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    Create Quiz
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
                      <span>{user.name}</span>
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-dark-800 rounded-xl shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Log in</Link>
                  <Link to="/register" className="btn-primary py-2 px-5 text-sm">Sign up</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900 border-b border-white/10 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white">Dashboard</Link>
              <Link to="/my-quizzes" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white">My Quizzes</Link>
              <Link to="/create-quiz" className="block px-3 py-2 text-base font-medium text-primary-400">Create Quiz</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white">Log in</Link>
              <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-400">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
