require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const sanitize = require('./middleware/sanitize');

// Load routes with individual error catching so a single bad import doesn't silently kill other routes
let authRoutes, resumeRoutes, aiRoutes, coverLetterRoutes;
try { authRoutes = require('./routes/auth'); console.log('✅ Auth routes loaded'); } catch(e) { console.error('❌ Auth routes failed:', e.message); }
try { resumeRoutes = require('./routes/resume'); console.log('✅ Resume routes loaded'); } catch(e) { console.error('❌ Resume routes failed:', e.message); }
try { aiRoutes = require('./routes/ai'); console.log('✅ AI routes loaded'); } catch(e) { console.error('❌ AI routes failed:', e.message); }
try { coverLetterRoutes = require('./routes/coverLetter'); console.log('✅ CoverLetter routes loaded'); } catch(e) { console.error('❌ CoverLetter routes failed:', e.message); }

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// AI rate limiter (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Too many AI requests, please wait a moment.' }
});
app.use('/api/ai/', aiLimiter);

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5176',
  'http://localhost:3000',
  'https://ats-checker-resume-builder.vercel.app',
  'https://client-beta-silk-62.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    // Allow any vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize request data (NoSQL injection and XSS protection)
app.use(sanitize);

// Static files (profile photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes — only mount if successfully imported
if (authRoutes) app.use('/api/auth', authRoutes);
if (resumeRoutes) app.use('/api/resumes', resumeRoutes);
if (aiRoutes) app.use('/api/ai', aiRoutes);
if (coverLetterRoutes) app.use('/api/cover-letters', coverLetterRoutes);

console.log('📡 Routes mounted:', [
  authRoutes ? '/api/auth' : null,
  resumeRoutes ? '/api/resumes' : null,
  aiRoutes ? '/api/ai' : null,
  coverLetterRoutes ? '/api/cover-letters' : null
].filter(Boolean).join(', '));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Root API welcome endpoint
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to the AI Resume Builder API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
