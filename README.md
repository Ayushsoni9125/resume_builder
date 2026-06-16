# AI Resume Builder

A production-ready full-stack AI Resume Builder built with React, Tailwind CSS, Node.js, Express, MongoDB, and Google Gemini AI.

## 🔗 Live Deployments

- **Frontend (Vercel)**: [https://ats-checker-resume-builder.vercel.app](https://ats-checker-resume-builder.vercel.app)
- **Backend (Render)**: [https://resume-builder-daq4.onrender.com](https://resume-builder-daq4.onrender.com)

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
# Runs on http://localhost:8000
```

### 3. Start the Frontend

```bash
cd client
npm run dev
# Runs on http://localhost:5176
```

### 4. Open the App

Visit the URL shown in the frontend terminal: [http://localhost:5176](http://localhost:5176)

---

## 📁 Project Structure

```
resume-builder/
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/db.js       # MongoDB connection
│   │   ├── models/            # User, Resume, CoverLetter mongoose models
│   │   ├── controllers/       # Auth, Resume, AI, CoverLetter controllers
│   │   ├── middleware/auth.js # JWT middleware
│   │   └── routes/            # auth, resume, ai, coverLetter routes
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

- **Authentication**: JWT signup/login, forgot/reset password via email.
- **Multi-step Resume Builder**: Guided 8-step form to easily structure personal info, summary, education, experience, skills, projects, certifications, and achievements.
- **5 Professional Templates**: Modern Pro, Minimal Clean, Dev Portfolio, Corporate ATS, Creative Designer.
- **AI-Powered Features** (Gemini API):
  - **Resume Parsing & Import**: Upload a `.pdf`, `.docx`, or `.txt` resume file, or paste raw text. The server extracts the text using `pdf-parse` / `mammoth` and automatically parses it into a structured schema using Gemini AI.
  - **ATS Score Calculator**: Evaluates completeness, keyword density, formatting, and skills to provide a score (0–100) and actionable feedback.
  - **AI Professional Summary Generator**: Instantly drafts a tailored summary based on experience, skills, and projects.
  - **AI Experience & Project Description Generator**: Generates concise, action-verb-rich bullet points.
  - **AI Cover Letter Generator**: Generates tailored, high-converting cover letters matching the user's resume to a target job title, company, and description.
  - **AI Job Description Matcher**: Scores resume matching against a job post, highlights matched/missing keywords, and recommends structural updates.
  - **AI Section Rewriter**: Refines description blocks using the STAR method, concise rewriting, or professional vocabulary.
- **Dual Export Options**:
  - **PDF Export**: Generate high-fidelity PDFs utilizing custom print stylesheets.
  - **Word Export**: Export resumes directly to fully styled `.doc` files containing color themes, table formatting, and clickable hyperlinks.
- **Resume Sharing**: Toggle public sharing on any resume and generate a unique public viewing URL.
- **Version History**: Capture and restore previous resume snapshots.
- **Auto-save**: Background auto-saves drafts every 30 seconds to prevent data loss.
- **Mobile Responsiveness**: Enhanced responsive layout scaling across smartphones, tablets, and desktop displays.

---

## 🔑 Environment Variables

### Server (`server/.env`)

```env
PORT=8000
MONGODB_URI=mongodb+srv://...  # Your MongoDB Atlas URI
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_key  # ← ADD THIS
CLIENT_URL=http://localhost:5176
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

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Log in and receive JWT |
| GET | `/api/auth/me` | Fetch currently logged-in user profile |
| PUT | `/api/auth/profile` | Update user name or profile picture |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Request password reset email |
| PUT | `/api/auth/reset-password/:token` | Complete password reset |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | List all user resumes |
| GET | `/api/resumes/:id` | Fetch single resume details |
| GET | `/api/resumes/shared/:shareId` | Fetch publicly shared resume |
| POST | `/api/resumes` | Create a new blank/parsed resume |
| PUT | `/api/resumes/:id` | Update resume contents |
| PATCH | `/api/resumes/:id/autosave` | Auto-save resume draft |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate an existing resume |
| PATCH | `/api/resumes/:id/share` | Toggle public resume sharing |
| POST | `/api/resumes/:id/versions` | Save a new resume version |
| POST | `/api/resumes/:id/versions/:versionId/restore` | Restore to a saved version |

### Cover Letters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cover-letters` | Fetch all saved cover letters |
| GET | `/api/cover-letters/:id` | Fetch a single cover letter |
| POST | `/api/cover-letters` | Save/create a new cover letter |
| DELETE | `/api/cover-letters/:id` | Delete a cover letter |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/parse-file` | Extract & parse resume from PDF, DOCX, or TXT file using AI |
| POST | `/api/ai/parse` | Parse raw resume text into JSON schema using AI |
| POST | `/api/ai/summary` | AI generate professional summary |
| POST | `/api/ai/project-description` | AI generate project bullet points |
| POST | `/api/ai/skill-suggestions` | AI suggest additional skills |
| POST | `/api/ai/improve` | AI analyze resume and suggest enhancements |
| POST | `/api/ai/ats-score` | Calculate ATS score |
| POST | `/api/ai/experience-description` | AI generate experience bullet points |
| POST | `/api/ai/import-socials` | Import resume data from GitHub & LinkedIn profiles |
| POST | `/api/ai/job-match` | Analyze resume against a job description for keyword matching |
| POST | `/api/ai/rewrite` | Rewrite specific text blocks (STAR, concise, professional) |
| POST | `/api/ai/generate-cover-letter` | Generate custom cover letter from resume data and job details |
