import express from 'express';

import {
  uploadAudio,
  getRecordings
}
from '../controllers/audioController.js';

import {
  protect
}
from '../middleware/auth.js';

import {
  upload
}
from '../middleware/fileUpload.js';

const router = express.Router();

// 🎤 Upload Audio
router.post(
  '/',
  protect,
  upload.single('audio'),
  uploadAudio
);

// 📊 Get Recordings
router.get(
  '/',
  protect,
  getRecordings
);

export default router;