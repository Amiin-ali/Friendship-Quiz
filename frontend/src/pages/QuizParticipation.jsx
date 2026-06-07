import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';

const QuizParticipation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participantName, setParticipantName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${slug}`);
        setQuiz(response.data);
      } catch (error) {
        toast.error('Quiz not found or is private');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [slug, navigate]);

  const handleStart = (e) => {
    e.preventDefault();
    if (!participantName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setHasStarted(true);
  };

  const handleAnswer = async (optionIndex) => {
    const question = quiz.questions[currentQuestionIndex];
    const newAnswers = [...answers, { questionId: question._id, selectedOption: optionIndex }];
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    } else {
      // Submit attempt
      setIsSubmitting(true);
      try {
        const payload = {
          participantName,
          answers: newAnswers,
          completionTime: 0 
        };
        const response = await api.post(`/quizzes/${slug}/attempt`, payload);
        toast.success('Quiz completed!');
        navigate(`/quiz/${slug}/results`, { 
          state: { 
            myResult: response.data,
            participantName
          } 
        });
      } catch (error) {
        toast.error('Failed to submit quiz');
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-center px-2 sm:px-0">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-6 sm:p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px] -z-10"></div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 pb-2">
              {quiz.title}
            </h1>
            <p className="text-slate-300 mb-8 max-w-md mx-auto text-sm sm:text-base">
              {quiz.description || `Test how well you know the creator!`}
            </p>

            <form onSubmit={handleStart} className="max-w-xs mx-auto space-y-4">
              <input
                type="text"
                required
                className="input-field text-center text-base sm:text-lg"
                placeholder="Enter your name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
              <button type="submit" className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-sm sm:text-base">
                Start Quiz <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-5 sm:p-6 md:p-10"
          >
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-slate-400 mb-4">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              </div>
              <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center leading-snug">
              {currentQuestion.question}
            </h2>

            <div className={`grid gap-3 sm:gap-4 ${currentQuestion.optionType === 'image' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isSubmitting}
                  className={`text-left bg-dark-900/50 border border-white/10 hover:border-primary-500/50 hover:bg-white/5 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 group overflow-hidden ${
                    currentQuestion.optionType === 'image' ? 'rounded-2xl p-0 aspect-square sm:aspect-auto sm:h-48' : 'rounded-xl px-4 sm:px-6 py-3 sm:py-4'
                  }`}
                >
                  {currentQuestion.optionType === 'image' ? (
                    <div className="relative w-full h-full">
                      {option ? (
                        <img src={option} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-800">
                          <ImageIcon className="w-8 h-8 text-slate-500" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs sm:text-sm font-medium text-white shadow-lg">
                        {String.fromCharCode(65 + index)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-dark-800 border border-white/20 flex items-center justify-center text-xs sm:text-sm font-medium text-slate-400 group-hover:bg-primary-500/20 group-hover:text-primary-400 group-hover:border-primary-500/50 transition-colors">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base sm:text-lg break-words">{option}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {isSubmitting && (
               <div className="mt-6 sm:mt-8 flex justify-center">
                 <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizParticipation;
