import { validationResult } from 'express-validator';
import { ApiError } from '../middleware/errorHandler.js';

// Validates request using express-validator
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Audio file validation
export const validateAudioFile = (file) => {
  // Check if file exists
  if (!file) {
    throw new ApiError('No audio file uploaded', 400);
  }
  
  // Check file type
  const allowedMimeTypes = [
    'audio/wav', 
    'audio/mpeg', 
    'audio/mp3', 
    'audio/ogg',
    'audio/webm'
  ];
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new ApiError('Invalid file type. Allowed types: WAV, MP3, OGG, WEBM', 400);
  }
  
  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  
  if (file.size > maxSize) {
    throw new ApiError('File too large. Maximum size is 10MB', 400);
  }
  
  return true;
};

// User input sanitization (prevents XSS)
export const sanitizeUserInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate language code
export const validateLanguageCode = (languageCode) => {
  // Common language codes in ISO 639-1 format plus country code
  const validLanguageCodes = [
    'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 
    'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN',
    'zh-TW', 'ru-RU', 'ar-SA', 'hi-IN', 'tr-TR'
  ];
  
  if (!validLanguageCodes.includes(languageCode)) {
    throw new ApiError('Invalid language code', 400);
  }
  
  return true;
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  // Requires at least 8 characters, including 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      'Password must be at least 8 characters and include uppercase, lowercase, and numbers',
      400
    );
  }
  
  return true;
};