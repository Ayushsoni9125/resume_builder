const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const educationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  institution: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
  gpa: { type: String },
  description: { type: String }
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  location: { type: String },
  description: { type: String }
}, { _id: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveDemo: { type: String },
  description: { type: String }
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  organization: { type: String, trim: true },
  date: { type: String },
  url: { type: String }
}, { _id: true });

const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number },
  data: { type: mongoose.Schema.Types.Mixed },
  savedAt: { type: Date, default: Date.now },
  label: { type: String }
}, { _id: true });

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Resume',
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  template: {
    type: String,
    enum: ['modern-professional', 'minimal-clean', 'developer-portfolio', 'corporate-ats', 'creative-designer'],
    default: 'modern-professional'
  },
  themeColor: {
    type: String,
    default: '#6C47FF'
  },
  personalInfo: {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    photo: { type: String }
  },
  summary: { type: String },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: {
    technical: [{ type: String }],
    soft: [{ type: String }]
  },
  certifications: [certificationSchema],
  achievements: [{ type: String }],
  languages: [{ name: String, proficiency: String }],
  sectionOrder: {
    type: [String],
    default: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements']
  },
  atsScore: {
    score: { type: Number, min: 0, max: 100, default: 0 },
    suggestions: [{ type: String }],
    lastCalculated: { type: Date }
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  lastAutoSaved: { type: Date },
  versions: [versionSchema]
}, {
  timestamps: true
});

// Compound index for user queries
resumeSchema.index({ userId: 1, createdAt: -1 });

// Generate share ID before saving if public
resumeSchema.pre('save', function () {
  if (this.isPublic && !this.shareId) {
    this.shareId = uuidv4().replace(/-/g, '').substring(0, 12);
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
