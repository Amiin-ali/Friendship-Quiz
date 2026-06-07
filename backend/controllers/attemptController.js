import Attempt from '../models/Attempt.js';
import Answer from '../models/Answer.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:slug/attempt
// @access  Public
const submitAttempt = async (req, res, next) => {
  try {
    const { participantName, answers, completionTime } = req.body;
    const { slug } = req.params;

    const quiz = await Quiz.findOne({ slug });
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Get all questions with correct answers to grade
    const questions = await Question.find({ quizId: quiz._id });
    
    let score = 0;
    const answerDocs = [];

    // Temporary Attempt to get ID
    const attempt = new Attempt({
      quizId: quiz._id,
      participantName,
      completionTime: completionTime || 0
    });

    for (const ans of answers) {
      const question = questions.find(q => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedOption;
        if (isCorrect) score += 1;
        
        answerDocs.push({
          attemptId: attempt._id,
          questionId: question._id,
          selectedOption: ans.selectedOption,
          isCorrect
        });
      }
    }

    const percentage = Math.round((score / questions.length) * 100);
    
    attempt.score = score;
    attempt.percentage = percentage;
    
    await attempt.save();
    await Answer.insertMany(answerDocs);

    res.status(201).json({
      attemptId: attempt._id,
      score,
      percentage,
      totalQuestions: questions.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ owner: req.user._id });
    const quizIds = quizzes.map(q => q._id);

    const attempts = await Attempt.find({ quizId: { $in: quizIds } })
      .populate('quizId', 'title slug')
      .sort({ createdAt: -1 });

    const totalQuizzes = quizzes.length;
    const totalParticipants = attempts.length;
    const averageScore = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length)
      : 0;

    res.status(200).json({
      totalQuizzes,
      totalParticipants,
      averageScore,
      recentAttempts: attempts.slice(0, 10), // Top 10 recent
    });
  } catch (error) {
    next(error);
  }
};

import jwt from 'jsonwebtoken';

// @desc    Get specific quiz attempts (Leaderboard)
// @route   GET /api/quizzes/:slug/attempts
// @access  Public (conditionally Private)
const getQuizAttempts = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug });
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    let isOwner = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id === quiz.owner.toString()) {
          isOwner = true;
        }
      } catch (error) {
        // Ignore token errors for public routes
      }
    }

    if (!quiz.isPublic && !isOwner) {
      return res.status(200).json({ isPrivate: true, message: 'Leaderboard is private' });
    }

    const attempts = await Attempt.find({ quizId: quiz._id })
      .sort({ percentage: -1, completionTime: 1 }) // Sort by highest score, then fastest
      .limit(50);

    res.status(200).json(attempts);
  } catch (error) {
    next(error);
  }
};

export { submitAttempt, getAnalytics, getQuizAttempts };
