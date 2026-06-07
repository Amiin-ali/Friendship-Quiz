import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, questions, isPublic } = req.body;

    // Generate a unique slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const quiz = await Quiz.create({
      title,
      description,
      slug,
      owner: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    // Create questions
    if (questions && questions.length > 0) {
      const questionsWithQuizId = questions.map((q) => ({
        ...q,
        quizId: quiz._id,
      }));
      await Question.insertMany(questionsWithQuizId);
    }

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quizzes
// @route   GET /api/quizzes
// @access  Private
const getMyQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz by slug (Public)
// @route   GET /api/quizzes/:slug
// @access  Public
const getQuizBySlug = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug })
      .populate({
        path: 'questions',
        select: 'question options optionType', // Exclude correctAnswer for public view
      })
      .populate('owner', 'name avatar');

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // Check user
    if (quiz.owner.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await quiz.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export { createQuiz, getMyQuizzes, getQuizBySlug, deleteQuiz };
