import express from 'express';
import { 
  analyzeRecording,
  getAnalyses,
  getAnalysis,
  getUserProgress 
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/recording/:id', protect, analyzeRecording);
router.get('/', protect, getAnalyses);
router.get('/:id', protect, getAnalysis);
router.get('/progress/:timeframe', protect, getUserProgress);

export default router;