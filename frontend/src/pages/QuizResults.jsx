import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, ArrowLeft, Share2, Award, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const QuizResults = () => {
  const { slug } = useParams();
  const location = useLocation();
  const myResult = location.state?.myResult;
  const participantName = location.state?.participantName;

  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptsRes] = await Promise.all([
          api.get(`/quizzes/${slug}`),
          api.get(`/quizzes/${slug}/attempts`).catch(() => ({ data: { isPrivate: true } }))
        ]);
        
        setQuiz(quizRes.data);

        if (attemptsRes.data.isPrivate) {
          setIsPrivate(true);
          setAttempts([]);
        } else {
          setAttempts(attemptsRes.data);
        }
      } catch (error) {
        toast.error('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const copyLink = () => {
    const url = `${window.location.origin}/quiz/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Quiz link copied!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) return null;

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 1: return <Medal className="h-6 w-6 text-slate-300" />;
      case 2: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-slate-500 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  const getFriendshipLevel = (percentage) => {
    if (percentage >= 90) return { text: 'Legendary Friend', color: 'text-primary-400' };
    if (percentage >= 80) return { text: 'Best Friend', color: 'text-green-400' };
    if (percentage >= 60) return { text: 'Close Friend', color: 'text-blue-400' };
    if (percentage >= 40) return { text: 'Friend', color: 'text-yellow-400' };
    if (percentage >= 20) return { text: 'Acquaintance', color: 'text-orange-400' };
    return { text: 'Stranger', color: 'text-red-400' };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors inline-flex">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <button onClick={copyLink} className="btn-secondary py-2 text-sm flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share Quiz
        </button>
      </div>

      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
          {isPrivate ? 'Your Result' : 'Leaderboard'}
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          {quiz.title}
        </p>
      </div>

      {myResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 text-center mb-12 relative overflow-hidden border-primary-500/30 bg-primary-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-2">Great job, {participantName}!</h2>
          <div className="text-5xl font-bold text-primary-400 mb-4">{myResult.percentage}%</div>
          <p className="text-lg text-slate-300 font-medium">
            You got {myResult.score} out of {myResult.totalQuestions} right!
          </p>
          <p className={`text-xl font-bold mt-4 ${getFriendshipLevel(myResult.percentage).color}`}>
            {getFriendshipLevel(myResult.percentage).text}
          </p>
        </motion.div>
      )}

      {isPrivate ? (
        !myResult && (
          <div className="glass-panel p-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">Quiz is Private</h2>
            <p className="text-slate-400">You must take the quiz to see your score. The public leaderboard is hidden.</p>
          </div>
        )
      ) : attempts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 text-center"
        >
          <Award className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No attempts yet</h2>
          <p className="text-slate-400 mb-6">Share your quiz link with friends to see who tops the leaderboard!</p>
          <button onClick={copyLink} className="btn-primary">
            Copy Quiz Link
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, index) => {
            const level = getFriendshipLevel(attempt.percentage);
            return (
              <motion.div
                key={attempt._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-panel p-4 md:p-6 flex items-center gap-4 md:gap-6 relative overflow-hidden group ${
                  index === 0 ? 'border-yellow-400/30 bg-yellow-400/5' : ''
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-[40px] pointer-events-none"></div>
                )}
                
                <div className="flex-shrink-0 w-8 md:w-12 flex justify-center">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg md:text-xl font-bold truncate">{attempt.participantName}</h3>
                  <p className={`text-sm md:text-base font-medium ${level.color}`}>
                    {level.text}
                  </p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl md:text-3xl font-bold">{attempt.percentage}%</div>
                  <div className="text-xs md:text-sm text-slate-400">{attempt.score} / {quiz.questions.length} correct</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizResults;
