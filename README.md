# AI Resume Builder

A production-ready full-stack AI Resume Builder built with React, Tailwind CSS, Node.js, Express, MongoDB, and Google Gemini AI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (URI already configured)
- Google Gemini API key

### 1. Add your Gemini API key to the server

Open `server/.env` and replace `your_gemini_api_key_here` with your actual key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Start the Backend

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### 3. Start the Frontend

```bash
cd client
npm run dev
# Runs on http://localhost:5173 (or next available port)
```

### 4. Open the App

Visit the URL shown in the frontend terminal (e.g. http://localhost:5173)

---

## 📁 Project Structure

```
resume-builder/
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/db.js       # MongoDB connection
│   │   ├── models/            # User, Resume mongoose models
│   │   ├── controllers/       # Auth, Resume, AI controllers
│   │   ├── middleware/auth.js # JWT middleware
│   │   └── routes/            # auth, resume, ai routes
│   ├── uploads/               # Profile photo uploads
│   └── .env                   # Environment variables
│
└── client/                    # React + Vite + Tailwind frontend
    └── src/
        ├── api/               # Axios + API helpers
        ├── store/             # Zustand auth + resume stores
        ├── pages/             # All route pages
        ├── components/
        │   ├── resume/        # Multi-step editor components
        │   └── templates/     # 5 resume templates
        └── index.css          # Global styles
```

---

## ✨ Features

- **Authentication**: JWT signup/login, forgot/reset password via email
- **Multi-step Resume Builder**: 8-step guided form
- **5 Professional Templates**: Modern Pro, Minimal Clean, Dev Portfolio, Corporate ATS, Creative Designer
- **AI Features** (Gemini API):
  - AI Professional Summary Generator
  - AI Project Description Generator  
  - AI Skill Suggestions
  - AI Resume Improvement Analysis
  - ATS Score Calculator (0–100)
- **Live Preview**: Real-time preview updates as you type
- **PDF Export**: One-click high-quality PDF download
- **Dashboard**: Manage multiple resumes (create, edit, delete, duplicate)
- **Resume Sharing**: Public share link generation
- **Version History**: Save and restore resume snapshots
- **Auto-save**: Background auto-save drafts every 30 seconds

---

## 🔑 Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://...  # Your MongoDB Atlas URI
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_key  # ← ADD THIS
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional: For forgot password email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@resumeai.com
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import repo in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`

### Backend → Render
1. Push `server/` to GitHub
2. Create a new Web Service on Render
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all `.env` variables in Render dashboard

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/resumes` | List user resumes |
| POST | `/api/resumes` | Create resume |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume |
| PATCH | `/api/resumes/:id/share` | Toggle public sharing |
| POST | `/api/ai/summary` | AI generate summary |
| POST | `/api/ai/project-description` | AI project desc |
| POST | `/api/ai/skill-suggestions` | AI skill suggestions |
| POST | `/api/ai/improve` | AI improvements |
| POST | `/api/ai/ats-score` | Calculate ATS score |
