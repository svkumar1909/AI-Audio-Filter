import asyncHandler from 'express-async-handler';
import Recording from '../models/Recording.js';
import { processAudio } from '../services/audioProcessing.js';
import { speechToText } from '../services/aiService.js';
import { analyzePronunciation } from '../services/analysisService.js';

// 🎤 Upload + analyze
export const uploadAudio = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an audio file'
    });
  }

  const { originalText, language } = req.body;

  const audioDetails = await processAudio(req.file.path);
  const audioPath = audioDetails.filePath;

  // 🧠 Speech → text
  const speechResult = await speechToText(audioPath, language || 'en-US');
  const transcription = speechResult.text || '';

  // 🎯 Score
  const score = analyzePronunciation(
    transcription,
    originalText,
    audioDetails.duration
  );

  const recording = await Recording.create({
    user: req.user.id,
    filePath: audioPath,
    duration: audioDetails.duration,
    language: language || 'en-US',

    originalText,
    transcription,

    accuracy: score.accuracy,
    fluency: score.fluency,
    overallScore: score.overallScore
  });

  res.status(201).json({
    success: true,
    data: {
      ...recording.toObject(),
      wordLevelFeedback: score.wordLevelFeedback,
      improvementSuggestions: score.improvementSuggestions,
      pronunciationMessage: score.pronunciationMessage
    }
  });
});


// 📊 GET recordings (FIXED)
export const getRecordings = asyncHandler(async (req, res) => {

  const recordings = await Recording.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: recordings
  });
});