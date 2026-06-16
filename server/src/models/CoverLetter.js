const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'My Cover Letter'
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for user cover letters queries
coverLetterSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
