import asyncHandler from 'express-async-handler';
import fs from 'fs';
import mongoose from 'mongoose';
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

  const audioDetails = await processAudio(req.file.path);

  const recording = await Recording.create({
    user: req.user.id,
    title: title || `Recording ${Date.now()}`,
    filePath: req.file.path,
    duration: audioDetails?.duration || 0,
    language: language || req.user.targetLanguage || 'English',
    originalText: originalText || '',
    transcription: ''
  });

  res.status(201).json({
    success: true,
    data: recording
  });
});


// @desc    Get all recordings (with pagination)
// @route   GET /api/audio
// @access  Private
export const getRecordings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const recordings = await Recording.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

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

  // ✅ Prevent crash for invalid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid recording ID'
    });
  }

  const recording = await Recording.findById(req.params.id).populate('analyses');

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }

  res.status(200).json({
    success: true,
    data: recording
  });
});


// @desc    Update recording
// @route   PUT /api/audio/:id
// @access  Private
export const updateRecording = asyncHandler(async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid recording ID'
    });
  }

  let recording = await Recording.findById(req.params.id);

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }

  recording = await Recording.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: recording
  });
});


// @desc    Delete recording
// @route   DELETE /api/audio/:id
// @access  Private
export const deleteRecording = asyncHandler(async (req, res) => {

  // ✅ Prevent crash
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid recording ID'
    });
  }

  const recording = await Recording.findById(req.params.id);

  if (!recording) {
    return res.status(404).json({
      success: false,
      message: 'Recording not found'
    });
  }

  if (recording.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }

  // ✅ Delete file safely
  if (recording.filePath && fs.existsSync(recording.filePath)) {
    fs.unlinkSync(recording.filePath);
  }

  await recording.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});