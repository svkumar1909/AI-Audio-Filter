import mongoose from 'mongoose';

const RecordingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    trim: true,
    maxlength: 100
  },

  filePath: {
    type: String,
    required: true
  },

  duration: Number,

  language: {
    type: String,
    default: 'en-US'
  },

  // 🎤 What user said
  transcription: {
    type: String,
    default: ''
  },

  // 🎯 What user should say
  originalText: {
    type: String,
    default: ''
  },

  // 📊 Scores
  overallScore: {
    type: Number,
    default: 0
  },

  accuracy: {
    type: Number,
    default: 0
  },

  fluency: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

export default mongoose.model('Recording', RecordingSchema);