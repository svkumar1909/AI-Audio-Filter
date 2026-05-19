import asyncHandler from 'express-async-handler';

import Recording from '../models/Recording.js';

import {
  processAudio
}
from '../services/audioProcessing.js';

import {
  speechToText
}
from '../services/aiService.js';

import {
  analyzeAudioPronunciation
}
from '../services/pronunciationService.js';

import {
  convertToWav
}
from '../services/audioConverter.js';

import {
  generateAIFeedback
}
from '../services/gptFeedbackService.js';


// =======================================
// 🎤 UPLOAD AUDIO
// =======================================

export const uploadAudio =
  asyncHandler(async (req, res) => {

    try {

      console.log(
        '========== NEW AUDIO =========='
      );

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            'Please upload an audio file'
        });
      }

      const {
        originalText,
        language
      } = req.body;

      // ===================================
      // PROCESS AUDIO
      // ===================================

      let audioDetails;

      try {

        audioDetails =
          await processAudio(
            req.file.path
          );

      } catch (error) {

        console.log(
          'PROCESS AUDIO ERROR:',
          error
        );

        audioDetails = {

          filePath:
            req.file.path,

          duration: 0
        };
      }

      // ===================================
      // AUDIO PATH
      // ===================================

      const originalAudioPath =
        audioDetails.filePath;

      // ===================================
      // CONVERT TO WAV
      // ===================================

      let wavPath =
        originalAudioPath;

      try {

        wavPath =
          await convertToWav(
            originalAudioPath
          );

      } catch (error) {

        console.log(
          'WAV CONVERSION ERROR:',
          error
        );
      }

      // ===================================
      // SPEECH TO TEXT
      // ===================================

      let transcription = '';

      let detectedLanguage =
        'unknown';

      try {

        const speechResult =
          await speechToText(
            wavPath
          );

        transcription =
          speechResult.text || '';

        detectedLanguage =
          speechResult.language || 'unknown';

      } catch (error) {

        console.log(
          'TRANSCRIPTION ERROR:',
          error
        );

        transcription =
          'Transcription failed';
      }

      // ===================================
      // AI ANALYSIS
      // ===================================

      let score = {

        pronunciation: 0,

        fluency: 0,

        confidence: 0,

        overall: 0,

        feedback: []
      };

      try {

        score =
          await analyzeAudioPronunciation(
            wavPath
          );

      } catch (error) {

        console.log(
          'AI ANALYSIS ERROR:',
          error
        );
      }

      // ===================================
      // AI FEEDBACK
      // ===================================

      let aiFeedback =
        'AI feedback unavailable';

      try {

        aiFeedback =
          await generateAIFeedback({

            transcript:
              transcription,

            targetText:
              originalText,

            pronunciationScore:
              score.pronunciation,

            fluencyScore:
              score.fluency,

            confidenceScore:
              score.confidence,

            detectedLanguage
          });

      } catch (error) {

        console.log(
          'GPT FEEDBACK ERROR:',
          error
        );
      }

      // ===================================
      // CLEAN AUDIO PATH
      // ===================================

      const cleanAudioPath =
        originalAudioPath
          .replace(/\\/g, '/')
          .split('uploads/')[1];

      // ===================================
      // SAVE RECORDING
      // ===================================

      const recording =
        await Recording.create({

          user: req.user.id,

          filePath:
            cleanAudioPath,

          duration:
            audioDetails.duration || 0,

          language:
            detectedLanguage,

          originalText:
            originalText || '',

          transcription,

          accuracy:
            score.pronunciation || 0,

          fluency:
            score.fluency || 0,

          overallScore:
            score.overall || 0
        });

      console.log(
        'RECORDING SAVED:',
        recording._id
      );

      // ===================================
      // RESPONSE
      // ===================================

      res.status(201).json({

        success: true,

        data: {

          ...recording.toObject(),

          aiFeedback,

          confidence:
            score.confidence,

          aiScores: {

            pronunciation:
              score.pronunciation,

            fluency:
              score.fluency,

            confidence:
              score.confidence,

            overall:
              score.overall
          }
        }
      });

    } catch (error) {

      console.log(
        'UPLOAD AUDIO ERROR:',
        error
      );

      res.status(500).json({

        success: false,

        message:
          'Audio upload failed',

        error:
          error.message
      });
    }
  });


// =======================================
// 📊 GET RECORDINGS
// =======================================

export const getRecordings =
  asyncHandler(async (req, res) => {

    try {

      const recordings =
        await Recording.find({

          user: req.user.id

        }).sort({

          createdAt: -1
        });

      res.status(200).json({

        success: true,

        data: recordings
      });

    } catch (error) {

      console.log(
        'GET RECORDINGS ERROR:',
        error
      );

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch recordings'
      });
    }
  });