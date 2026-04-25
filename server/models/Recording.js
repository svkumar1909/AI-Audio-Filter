import mongoose from 'mongoose';

const RecordingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  filePath: {
    type: String,
    required: [true, 'Audio file path is required']
  },
  duration: {
    type: Number,
    required: false
  },
  language: {
    type: String,
    required: [true, 'Language is required']
  },
  transcription: {
    type: String,
    required: false
  },
  originalText: {
    type: String,
    required: false,
    description: 'The text that user was trying to pronounce, if available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for analysis
RecordingSchema.virtual('analyses', {
  ref: 'Analysis',
  localField: '_id',
  foreignField: 'recording',
  justOne: false
});

const Recording = mongoose.model('Recording', RecordingSchema);

export default Recording;