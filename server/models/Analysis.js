import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  recording: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recording',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  wordScores: [{
    word: String,
    startTime: Number,
    endTime: Number,
    score: Number,
    correctPronunciation: String,
    userPronunciation: String,
    issues: [String]
  }],
  phonemeScores: [{
    phoneme: String,
    score: Number,
    examples: [String]
  }],
  suggestions: [{
    type: String
  }],
  aiServiceUsed: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;