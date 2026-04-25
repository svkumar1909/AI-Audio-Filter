import asyncHandler from 'express-async-handler';
import Recording from '../models/Recording.js';
import Analysis from '../models/Analysis.js';
import * as aiService from '../services/aiService.js';

// @desc    Analyze a recording
// @route   POST /api/analysis/recording/:id
// @access  Private
export const analyzeRecording = asyncHandler(async (req, res) => {
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
      message: 'Not authorized to analyze this recording'
    });
  }

  // Send to AI service for analysis
  const analysisResult = await analyzeAudio(
    recording.filePath,
    recording.language,
    recording.originalText
  );

  // If the recording didn't have a transcription yet, update it
  if (!recording.transcription && analysisResult.transcription) {
    recording.transcription = analysisResult.transcription;
    await recording.save();
  }

  // Create analysis record
  const analysis = await Analysis.create({
    recording: recording._id,
    user: req.user.id,
    overallScore: analysisResult.overallScore,
    wordScores: analysisResult.wordScores,
    phonemeScores: analysisResult.phonemeScores,
    suggestions: analysisResult.suggestions,
    aiServiceUsed: analysisResult.aiServiceUsed
  });

  res.status(201).json({
    success: true,
    data: analysis
  });
});

// @desc    Get all analyses for a user
// @route   GET /api/analysis
// @access  Private
export const getAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user.id })
    .populate('recording', 'title createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: analyses.length,
    data: analyses
  });
});

// @desc    Get single analysis
// @route   GET /api/analysis/:id
// @access  Private
export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id)
    .populate('recording');

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  // Check analysis belongs to user
  if (analysis.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this analysis'
    });
  }

  res.status(200).json({
    success: true,
    data: analysis
  });
});

// @desc    Get user progress over time
// @route   GET /api/analysis/progress/:timeframe
// @access  Private
export const getUserProgress = asyncHandler(async (req, res) => {
  const { timeframe } = req.params; // e.g., 'week', 'month', 'year'
  
  let dateFilter = {};
  const now = new Date();
  
  if (timeframe === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: weekAgo } };
  } else if (timeframe === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: monthAgo } };
  } else if (timeframe === 'year') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: yearAgo } };
  }

  // Get all analyses in timeframe
  const analyses = await Analysis.find({
    user: req.user.id,
    ...dateFilter
  }).sort({ createdAt: 1 });

  // Calculate average scores per day
  const scoresByDate = analyses.reduce((acc, analysis) => {
    const date = analysis.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { 
        scores: [], 
        phonemes: {} 
      };
    }
    
    acc[date].scores.push(analysis.overallScore);
    
    // Aggregate phoneme scores
    analysis.phonemeScores.forEach(phoneme => {
      if (!acc[date].phonemes[phoneme.phoneme]) {
        acc[date].phonemes[phoneme.phoneme] = [];
      }
      acc[date].phonemes[phoneme.phoneme].push(phoneme.score);
    });
    
    return acc;
  }, {});

  // Calculate averages
  const progressData = Object.keys(scoresByDate).map(date => {
    const dayData = scoresByDate[date];
    const avgScore = dayData.scores.reduce((sum, score) => sum + score, 0) / dayData.scores.length;
    
    // Calculate average phoneme scores
    const phonemeScores = {};
    Object.keys(dayData.phonemes).forEach(phoneme => {
      const scores = dayData.phonemes[phoneme];
      phonemeScores[phoneme] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    return {
      date,
      avgScore,
      recordingsCount: dayData.scores.length,
      phonemeScores
    };
  });

  res.status(200).json({
    success: true,
    timeframe,
    data: progressData
  });
});