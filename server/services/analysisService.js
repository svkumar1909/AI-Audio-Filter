import Analysis from '../models/Analysis.js';
import Recording from '../models/Recording.js';
import * as aiService from './aiService.js';
import * as audioProcessing from './audioProcessing.js';
import { ApiError } from '../middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Analyze a recording and save results
export const analyzeRecording = async (recordingId, userId) => {
  try {
    // Find the recording
    const recording = await Recording.findOne({ 
      _id: recordingId,
      user: userId
    });
    
    if (!recording) {
      throw new ApiError('Recording not found', 404);
    }
    
    // Get audio file path
    const audioFilePath = path.join(__dirname, '..', recording.filePath);
    
    // Ensure file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new ApiError('Audio file not found', 404);
    }
    
    // First, convert speech to text if there's no transcription
    let transcription = recording.transcription;
    if (!transcription) {
      const speechResult = await aiService.speechToText(
        audioFilePath, 
        recording.language || 'en-US'
      );
      
      transcription = speechResult.text;
      
      // Update recording with transcription
      recording.transcription = transcription;
      await recording.save();
    }
    
    // Analyze pronunciation against target text
    const analysisResult = await aiService.analyzePronunciation(
      audioFilePath,
      recording.textPrompt,
      recording.language || 'en-US'
    );
    
    // Create analysis record
    const analysis = new Analysis({
      user: userId,
      recording: recordingId,
      overallScore: analysisResult.overallScore,
      scoreClassification: analysisResult.scoreClassification,
      wordLevelFeedback: analysisResult.wordLevelFeedback,
      issues: analysisResult.issues,
      improvementSuggestions: analysisResult.improvementSuggestions,
      userTranscription: transcription,
      targetText: recording.textPrompt
    });
    
    // Save analysis
    await analysis.save();
    
    // Update recording with analysis ID
    recording.analysis = analysis._id;
    await recording.save();
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing recording:', error);
    throw error;
  }
};

// Get analysis history for a user
export const getUserAnalysisHistory = async (userId, limit = 10, skip = 0) => {
  try {
    const analyses = await Analysis.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recording', 'textPrompt audioUrl createdAt');
    
    return analyses;
  } catch (error) {
    console.error('Error getting analysis history:', error);
    throw error;
  }
};

// Get user progress statistics
export const getUserProgress = async (userId) => {
  try {
    // Get all analyses for the user
    const analyses = await Analysis.find({ user: userId })
      .sort({ createdAt: 1 });
    
    if (analyses.length === 0) {
      return {
        improvementRate: 0,
        averageScore: 0,
        bestScore: 0,
        recentTrend: 'neutral',
        practiceCount: 0,
        progressByWeek: []
      };
    }
    
    // Calculate average score
    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0);
    const averageScore = Math.round(totalScore / analyses.length);
    
    // Find best score
    const bestScore = Math.max(...analyses.map(analysis => analysis.overallScore));
    
    // Calculate improvement (first score vs last score)
    const firstScore = analyses[0].overallScore;
    const lastScore = analyses[analyses.length - 1].overallScore;
    const improvementRate = Math.round(((lastScore - firstScore) / firstScore) * 100);
    
    // Calculate recent trend (last 5 recordings)
    const recentAnalyses = analyses.slice(-5);
    let recentTrend = 'neutral';
    
    if (recentAnalyses.length >= 3) {
      const firstRecentScore = recentAnalyses[0].overallScore;
      const lastRecentScore = recentAnalyses[recentAnalyses.length - 1].overallScore;
      
      if (lastRecentScore - firstRecentScore > 5) {
        recentTrend = 'improving';
      } else if (firstRecentScore - lastRecentScore > 5) {
        recentTrend = 'declining';
      } else {
        recentTrend = 'stable';
      }
    }
    
    // Group progress by week
    const progressByWeek = calculateWeeklyProgress(analyses);
    
    return {
      improvementRate,
      averageScore,
      bestScore,
      recentTrend,
      practiceCount: analyses.length,
      progressByWeek
    };
  } catch (error) {
    console.error('Error calculating user progress:', error);
    throw error;
  }
};

// Helper function to calculate weekly progress
function calculateWeeklyProgress(analyses) {
  const weeklyProgress = [];
  const weeklyScores = {};
  
  analyses.forEach(analysis => {
    const date = new Date(analysis.createdAt);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyScores[weekKey]) {
      weeklyScores[weekKey] = {
        scores: [],
        startDate: weekStart
      };
    }
    
    weeklyScores[weekKey].scores.push(analysis.overallScore);
  });
  
  // Calculate average score for each week
  Object.keys(weeklyScores).forEach(weekKey => {
    const weekData = weeklyScores[weekKey];
    const totalScore = weekData.scores.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / weekData.scores.length);
    
    weeklyProgress.push({
      weekStarting: weekData.startDate,
      averageScore,
      practiceCount: weekData.scores.length
    });
  });
  
  // Sort by date
  return weeklyProgress.sort((a, b) => a.weekStarting - b.weekStarting);
}

// Helper function to get the start of the week (Sunday)
function getWeekStart(date) {
  const dateCopy = new Date(date);
  const day = dateCopy.getDay();
  const diff = dateCopy.getDate() - day;
  
  return new Date(dateCopy.setDate(diff));
}