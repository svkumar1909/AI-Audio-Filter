// Configuration for AI services (speech-to-text, pronunciation analysis)

const aiServicesConfig = {
  // Speech recognition service settings
  speechRecognition: {
    // API endpoint or configuration for speech-to-text service
    apiEndpoint: process.env.SPEECH_API_ENDPOINT || 'https://api.speechrecognition.example/v1',
    apiKey: process.env.SPEECH_API_KEY,
    language: process.env.DEFAULT_LANGUAGE || 'en-US',
    options: {
      sampleRate: 16000,
      encoding: 'LINEAR16',
      languageCode: 'en-US',
    }
  },
  
  // Pronunciation scoring/analysis service settings
  pronunciationAnalysis: {
    apiEndpoint: process.env.PRONUNCIATION_API_ENDPOINT || 'https://api.pronunciation.example/v1',
    apiKey: process.env.PRONUNCIATION_API_KEY,
    scoreThresholds: {
      excellent: 90,
      good: 75,
      fair: 60,
      needsWork: 0
    },
    options: {
      detailed: true,
      includeWordLevelAnalysis: true,
      includePhonemeBreakdown: true
    }
  },
  
  // Fallback settings for local processing if API is unavailable
  localProcessing: {
    enabled: process.env.ENABLE_LOCAL_PROCESSING === 'true' || false,
    modelPath: process.env.LOCAL_MODEL_PATH || './models/pronunciation',
    accuracy: 'medium' // Options: 'low', 'medium', 'high'
  }
};

export default aiServicesConfig;