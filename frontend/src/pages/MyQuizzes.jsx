import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Link as LinkIcon, Trash2, ExternalLink, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/quiz/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const deleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter(q => q._id !== id));
        toast.success('Quiz deleted');
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Quizzes</h1>
          <p className="text-slate-400">Manage and share your friendship quizzes.</p>
        </div>
        <Link to="/create-quiz" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-panel p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto bg-dark-700 rounded-full flex items-center justify-center mb-6">
            <Plus className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No quizzes yet</h2>
          <p className="text-slate-400 mb-6">Create your first friendship quiz and see who knows you best!</p>
          <Link to="/create-quiz" className="btn-primary inline-flex">
            Create First Quiz
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div 
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card flex flex-col h-full overflow-hidden group"
            >
              <div className="h-2 w-full bg-gradient-to-r from-primary-400 to-secondary-400"></div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold line-clamp-1" title={quiz.title}>{quiz.title}</h3>
                  <span className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded-full font-medium">
                    {quiz.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-2">
                  {quiz.description || "No description provided."}
                </p>
                
                <div className="flex items-center gap-2 mt-auto">
                  <button 
                    onClick={() => copyLink(quiz.slug)}
                    className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2 bg-dark-700/50 hover:bg-dark-700"
                  >
                    <LinkIcon className="h-4 w-4" /> Share
                  </button>
                  <Link 
                    to={`/quiz/${quiz.slug}/results`}
                    className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2 bg-dark-700/50 hover:bg-dark-700"
                  >
                    <BarChart2 className="h-4 w-4" /> Results
                  </Link>
                  <button 
                    onClick={() => deleteQuiz(quiz._id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                    title="Delete Quiz"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
