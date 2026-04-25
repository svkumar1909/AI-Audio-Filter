import axios from 'axios';
import fs from 'fs';
import path from 'path';
import aiConfig from '../config/aiServices.js';
import { ApiError } from '../middleware/errorHandler.js';

// Speech-to-text conversion service
export const speechToText = async (audioFilePath, language = 'en-US') => {
  try {
    // Prepare audio data
    const audioFile = fs.readFileSync(audioFilePath);
    const audioData = audioFile.toString('base64');
    
    // Use external API for speech-to-text
    const response = await axios.post(
      aiConfig.speechRecognition.apiEndpoint,
      {
        audio: {
          content: audioData
        },
        config: {
          ...aiConfig.speechRecognition.options,
          languageCode: language
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${aiConfig.speechRecognition.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.data || !response.data.results) {
      throw new ApiError('Failed to transcribe audio', 500);
    }
    
    // Extract transcribed text
    const transcription = response.data.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');
    
    return {
      text: transcription,
      confidence: response.data.results[0]?.alternatives[0]?.confidence || 0
    };
  } catch (error) {
    console.error('Speech-to-text error:', error.message);
    
    // If external API fails and local processing is enabled, try local method
    if (aiConfig.localProcessing.enabled) {
      return await fallbackSpeechToText(audioFilePath, language);
    }
    
    throw new ApiError('Failed to process speech', 500, { 
      originalError: error.message 
    });
  }
};

// Analyze pronunciation comparing user audio against expected pronunciation
export const analyzePronunciation = async (audioFilePath, targetText, language = 'en-US') => {
  try {
    // Prepare audio data
    const audioFile = fs.readFileSync(audioFilePath);
    const audioData = audioFile.toString('base64');
    
    // Use external API for pronunciation analysis
    const response = await axios.post(
      aiConfig.pronunciationAnalysis.apiEndpoint,
      {
        audio: {
          content: audioData
        },
        config: {
          ...aiConfig.pronunciationAnalysis.options,
          languageCode: language,
          referenceText: targetText
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${aiConfig.pronunciationAnalysis.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.data) {
      throw new ApiError('Failed to analyze pronunciation', 500);
    }
    
    // Process and format the analysis results
    const analysisResult = processAnalysisResponse(response.data, targetText);
    return analysisResult;
  } catch (error) {
    console.error('Pronunciation analysis error:', error.message);
    
    // If external API fails and local processing is enabled, try local method
    if (aiConfig.localProcessing.enabled) {
      return await fallbackPronunciationAnalysis(audioFilePath, targetText, language);
    }
    
    throw new ApiError('Failed to analyze pronunciation', 500, { 
      originalError: error.message 
    });
  }
};

// Helper function to process and format pronunciation analysis response
function processAnalysisResponse(data, targetText) {
  // Extract overall score
  const overallScore = Math.round(data.pronunciationAssessment?.accuracyScore || 0);
  
  // Get score classification based on thresholds
  const scoreClassification = getScoreClassification(overallScore);
  
  // Format word-level feedback if available
  const wordLevelFeedback = data.pronunciationAssessment?.words?.map(word => {
    return {
      word: word.word,
      score: Math.round(word.accuracyScore || 0),
      problems: word.error ? [word.error] : [],
      startTime: word.startTime || 0,
      endTime: word.endTime || 0
    };
  }) || [];
  
  // Identify specific issues and provide improvement suggestions
  const issues = identifyPronunciationIssues(wordLevelFeedback, targetText);
  
  return {
    overallScore,
    scoreClassification,
    wordLevelFeedback,
    issues,
    improvementSuggestions: generateImprovementSuggestions(issues)
  };
}

// Helper function to classify scores
function getScoreClassification(score) {
  const thresholds = aiConfig.pronunciationAnalysis.scoreThresholds;
  
  if (score >= thresholds.excellent) return 'excellent';
  if (score >= thresholds.good) return 'good';
  if (score >= thresholds.fair) return 'fair';
  return 'needsWork';
}

// Helper function to identify common pronunciation issues
function identifyPronunciationIssues(wordLevelFeedback, targetText) {
  const issues = [];
  
  // Find words with low scores
  const lowScoringWords = wordLevelFeedback.filter(word => word.score < 60);
  
  if (lowScoringWords.length > 0) {
    issues.push({
      type: 'wordAccuracy',
      description: 'Some words were pronounced incorrectly',
      affectedWords: lowScoringWords.map(w => w.word)
    });
  }
  
  // Check for missing words
  const transcribedWords = wordLevelFeedback.map(w => w.word.toLowerCase());
  const targetWords = targetText.toLowerCase().split(/\s+/);
  
  const missingWords = targetWords.filter(word => !transcribedWords.includes(word));
  if (missingWords.length > 0) {
    issues.push({
      type: 'missingWords',
      description: 'Some words were missing from your pronunciation',
      affectedWords: missingWords
    });
  }
  
  return issues;
}

// Helper function to generate improvement suggestions
function generateImprovementSuggestions(issues) {
  const suggestions = [];
  
  issues.forEach(issue => {
    switch (issue.type) {
      case 'wordAccuracy':
        suggestions.push(`Practice pronouncing these words: ${issue.affectedWords.join(', ')}`);
        break;
      case 'missingWords':
        suggestions.push(`Make sure to include all words in the phrase, especially: ${issue.affectedWords.join(', ')}`);
        break;
      // Add more suggestion types as needed
    }
  });
  
  // General suggestions if no specific issues found
  if (suggestions.length === 0) {
    suggestions.push('Continue practicing to improve overall fluency');
  }
  
  return suggestions;
}

// Fallback function for local processing if API is unavailable
async function fallbackSpeechToText(audioFilePath, language) {
  console.log('Using fallback speech-to-text processing');
  // Implement a simple fallback method or return placeholder
  return {
    text: "Fallback processing could not determine text",
    confidence: 0
  };
}

// Fallback function for local pronunciation analysis if API is unavailable
async function fallbackPronunciationAnalysis(audioFilePath, targetText, language) {
  console.log('Using fallback pronunciation analysis');
  // Implement a simple fallback method or return placeholder analysis
  return {
    overallScore: 50,
    scoreClassification: 'fair',
    wordLevelFeedback: [],
    issues: [{
      type: 'apiUnavailable',
      description: 'Detailed analysis unavailable - using fallback processing'
    }],
    improvementSuggestions: ['Try again later when the analysis service is available']
  };
}