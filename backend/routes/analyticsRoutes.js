import express from 'express';
const router = express.Router();
import { getAnalytics } from '../controllers/attemptController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getAnalytics);

export default router;
