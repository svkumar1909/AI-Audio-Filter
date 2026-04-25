import express from 'express';
import { 
  uploadAudio,
  getRecordings,
  getRecording,
  deleteRecording,
  updateRecording 
} from '../controllers/audioController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.post('/', protect, upload.single('audio'), uploadAudio);
router.get('/', protect, getRecordings);
router.get('/:id', protect, getRecording);
router.put('/:id', protect, updateRecording);
router.delete('/:id', protect, deleteRecording);

export default router;