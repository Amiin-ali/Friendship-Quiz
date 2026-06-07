import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle2, Image as ImageIcon, Type, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const QuizBuilder = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [quizInfo, setQuizInfo] = useState({
    title: '',
    description: '',
    isPublic: true,
  });
  
  const [questions, setQuestions] = useState([
    { id: 1, question: '', optionType: 'text', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { id: Date.now(), question: '', optionType: 'text', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      toast.error('You need at least one question');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleImageUpload = async (qId, optIndex, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const uploadToast = toast.loading('Uploading image...');
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // the API returns the image path e.g. /uploads/image-123.jpg
      const imageUrl = `http://localhost:5000${res.data}`;
      updateOption(qId, optIndex, imageUrl);
      toast.success('Image uploaded', { id: uploadToast });
    } catch (error) {
      toast.error('Upload failed', { id: uploadToast });
    }
  };

  const handleSave = async () => {
    if (!quizInfo.title.trim()) {
      toast.error('Please add a quiz title');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Please fill all options for Question ${i + 1}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        title: quizInfo.title,
        description: quizInfo.description,
        isPublic: quizInfo.isPublic,
        questions: questions.map(q => ({
          question: q.question,
          optionType: q.optionType,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };

      const { data } = await api.post('/quizzes', payload);
      toast.success('Quiz created successfully!');
      navigate(`/my-quizzes`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Quiz</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 sm:p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
          <input
            type="text"
            className="input-field text-lg sm:text-xl font-semibold"
            placeholder="e.g. Do you really know me?"
            value={quizInfo.title}
            onChange={(e) => setQuizInfo({...quizInfo, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
          <textarea
            className="input-field min-h-[80px] sm:min-h-[100px] resize-y text-sm sm:text-base"
            placeholder="A short description for your friends..."
            value={quizInfo.description}
            onChange={(e) => setQuizInfo({...quizInfo, description: e.target.value})}
          />
        </div>
        <div className="flex items-center justify-between bg-dark-900/50 p-4 rounded-xl border border-white/10">
          <div>
            <h4 className="font-medium">Quiz Privacy</h4>
            <p className="text-sm text-slate-400">{quizInfo.isPublic ? "Anyone with the link can view and take." : "Only you can access this quiz."}</p>
          </div>
          <button 
            onClick={() => setQuizInfo({...quizInfo, isPublic: !quizInfo.isPublic})}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${quizInfo.isPublic ? 'bg-primary-500' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${quizInfo.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence>
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-gradient-to-b from-primary-400 to-secondary-400"></div>
              <div className="p-4 sm:p-8 ml-1 sm:ml-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-dark-700 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-white/10 flex-shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold">Question</h3>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                    <div className="flex bg-dark-900/50 p-1 rounded-lg border border-white/10">
                      <button 
                        onClick={() => updateQuestion(q.id, 'optionType', 'text')}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-md flex items-center gap-1 transition-colors ${q.optionType === 'text' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Type className="w-3 h-3 sm:w-4 sm:h-4" /> Text
                      </button>
                      <button 
                        onClick={() => updateQuestion(q.id, 'optionType', 'image')}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-md flex items-center gap-1 transition-colors ${q.optionType === 'image' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Image
                      </button>
                    </div>
                    <button 
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <input
                    type="text"
                    className="input-field text-sm sm:text-base"
                    placeholder="Enter your question..."
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {q.options.map((opt, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`relative rounded-xl border-2 transition-all ${
                          q.correctAnswer === optIndex 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-white/10 bg-dark-900/50 hover:border-white/20'
                        } ${q.optionType === 'image' ? 'h-32 sm:h-40 flex flex-col justify-center items-center overflow-hidden group' : ''}`}
                      >
                        {q.optionType === 'text' ? (
                          <input
                            type="text"
                            className="w-full bg-transparent px-3 sm:px-4 py-3 text-sm sm:text-base outline-none pr-10 sm:pr-12"
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                          />
                        ) : (
                          <>
                            {opt ? (
                              <div className="relative w-full h-full">
                                <img src={opt} alt={`Option ${optIndex + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <label className="cursor-pointer btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                                    <Upload className="w-3 h-3" /> Change
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(q.id, optIndex, e.target.files[0])} />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors w-full h-full justify-center">
                                <Upload className="w-6 h-6" />
                                <span className="text-xs sm:text-sm">Upload Image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(q.id, optIndex, e.target.files[0])} />
                              </label>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                          className={`absolute right-2 sm:right-3 top-1/2 sm:top-auto sm:bottom-3 -translate-y-1/2 sm:translate-y-0 p-1.5 bg-dark-900/80 sm:bg-transparent rounded-full transition-colors z-10 ${
                            q.correctAnswer === optIndex
                              ? 'text-primary-400'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Set as correct answer"
                        >
                          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 text-center">Click the checkmark next to the correct answer.</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-12 pt-4">
        <button 
          onClick={addQuestion}
          className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Question
        </button>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Save className="h-5 w-5" /> Save Quiz</>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizBuilder;
