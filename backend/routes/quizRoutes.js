import express from 'express';
const router = express.Router();
import {
  createQuiz,
  getMyQuizzes,
  getQuizBySlug,
  deleteQuiz,
} from '../controllers/quizController.js';
import { submitAttempt, getQuizAttempts } from '../controllers/attemptController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createQuiz)
  .get(protect, getMyQuizzes);

router.route('/:slug')
  .get(getQuizBySlug); // Public access

router.route('/:id')
  .delete(protect, deleteQuiz);

router.post('/:slug/attempt', submitAttempt); // Public access
router.get('/:slug/attempts', getQuizAttempts); // Public access

export default router;
