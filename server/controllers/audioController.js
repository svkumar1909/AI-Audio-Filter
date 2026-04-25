import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import Recording from '../models/Recording.js';
import { processAudio } from '../services/audioProcessing.js';

// @desc    Upload audio recording
// @route   POST /api/audio
// @access  Private
export const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an audio file'
    });
  }

  const { title, language, originalText } = req.body;

  // Process the uploaded audio
  const audioDetails = await processAudio(req.file.path);

  // Create recording in DB
  const recording = await Recording.create({
    user: req.user.id,
    title: title || `Recording ${Date.now()}`,
    filePath: req.file.path,
    duration: audioDetails.duration,
    language: language || req.user.targetLanguage || 'en',
    originalText: originalText || '',
    transcription: '' // Will be populated after AI processing
  });

  res.status(201).json({
    success: true,
    data: recording
  });
});

// @desc    Get all recordings for a user
// @route   GET /api/audio
// @access  Private
export const getRecordings = asyncHandler(async (req, res) => {
  const recordings = await Recording.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: recordings.length,
    data: recordings
  });
});

// @desc    Get single recording
// @route   GET /api/audio/:id
// @access  Private
export const getRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.findById(req.params.id).populate('analyses');

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  // Check recording belongs to user
  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this recording'
    });
  }

  res.status(200).json({
    success: true,
    data: recording
  });
});

// @desc    Update recording details
// @route   PUT /api/audio/:id
// @access  Private
export const updateRecording = asyncHandler(async (req, res) => {
  let recording = await Recording.findById(req.params.id);

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  // Check recording belongs to user
  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this recording'
    });
  }

  recording = await Recording.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: recording
  });
});

// @desc    Delete recording
// @route   DELETE /api/audio/:id
// @access  Private
export const deleteRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.findById(req.params.id);

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  // Check recording belongs to user
  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this recording'
    });
  }

  // Delete file from server
  if (fs.existsSync(recording.filePath)) {
    fs.unlinkSync(recording.filePath);
  }

  // Change from .remove() to deleteOne() as it's the modern approach in Mongoose
  await recording.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});