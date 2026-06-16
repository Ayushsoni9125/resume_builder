import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Edit3, Trash2, Copy, Eye, Share2, MoreVertical,
  Sparkles, LogOut, User, Clock, TrendingUp, Download, History, X, Check, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useResumeStore from '../store/resumeStore';
import { resumeAPI, aiAPI } from '../api';

const TEMPLATE_LABELS = {
  'modern-professional': 'Modern Professional',
  'minimal-clean': 'Minimal Clean',
  'developer-portfolio': 'Developer Portfolio',
  'corporate-ats': 'Corporate ATS',
  'creative-designer': 'Creative Designer',
};

function ATSRing({ score }) {
  const r = 28, c = 2 * Math.PI * r;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const dash = (score / 100) * c;
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function ResumeCard({ resume, onDelete, onDuplicate, onShare }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card-hover group relative"
    >
      {/* Template preview strip */}
      <div className="h-2 rounded-t-xl bg-gradient-primary mb-4 -mt-6 -mx-6 rounded-b-none" />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary-400 shrink-0" />
            <h3 className="font-semibold text-dark-900 truncate">{resume.title}</h3>
            {resume.isDraft && <span className="badge-warning text-xs px-1.5 py-0.5 rounded">Draft</span>}
          </div>
          <p className="text-xs text-dark-600">{resume.personalInfo?.fullName || 'No name set'}</p>
          <p className="text-xs text-dark-600 mt-0.5">{TEMPLATE_LABELS[resume.template] || resume.template}</p>
        </div>

        {/* ATS Score */}
        <div className="ml-3 shrink-0">
          <ATSRing score={resume.atsScore?.score || 0} />
          <p className="text-xs text-center text-dark-600 mt-1">ATS</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3 text-xs text-dark-600">
        <Clock className="w-3 h-3" />
        <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-200">
        <button onClick={() => navigate(`/resume/${resume._id}/edit`)}
          className="btn-secondary flex-1 py-2 text-sm justify-center" id={`edit-resume-${resume._id}`}>
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={() => navigate(`/resume/${resume._id}/preview`)}
          className="btn-ghost py-2 px-3 text-sm" id={`preview-resume-${resume._id}`}>
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* More menu */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost py-2 px-3" id={`menu-resume-${resume._id}`}>
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-44 bg-white border border-dark-200 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <button onClick={() => { onDuplicate(resume._id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-100 hover:text-dark-900 transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button onClick={() => { onShare(resume._id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-100 hover:text-dark-900 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> {resume.isPublic ? 'Unshare' : 'Share Link'}
                </button>
                <button onClick={() => { navigate(`/portfolio/${resume._id}`); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-100 hover:text-dark-900 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" /> Portfolio Site
                </button>
                <div className="h-px bg-dark-200 mx-3" />
                <button onClick={() => { onDelete(resume._id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { resumes, setResumes, isLoadingResumes, setLoadingResumes, removeResume } = useResumeStore();
  const navigate = useNavigate();

  // Upload Parser states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      try {
        const { data } = await resumeAPI.getAll();
        setResumes(data.resumes);
      } catch {
        toast.error('Failed to load resumes');
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    try {
      await resumeAPI.delete(id);
      removeResume(id);
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const { data } = await resumeAPI.duplicate(id);
      setResumes([data.resume, ...resumes]);
      toast.success('Resume duplicated!');
    } catch {
      toast.error('Failed to duplicate resume');
    }
  };

  const handleShare = async (id) => {
    try {
      const { data } = await resumeAPI.toggleShare(id);
      if (data.isPublic && data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        toast.success('Share link copied to clipboard!');
      } else {
        toast.success('Resume is now private');
      }
      // refresh list
      const { data: list } = await resumeAPI.getAll();
      setResumes(list.resumes);
    } catch {
      toast.error('Failed to toggle share');
    }
  };

  const handleUploadParse = async (e) => {
    e.preventDefault();
    if (!uploadFile && !uploadText.trim()) {
      return toast.error('Please paste resume text or upload a file');
    }
    
    setIsParsing(true);
    try {
      let parsedResume;
      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        const { data: parseData } = await aiAPI.parseResumeFile(formData);
        parsedResume = parseData.resumeData;
      } else {
        const { data: parseData } = await aiAPI.parseResume(uploadText);
        parsedResume = parseData.resumeData;
      }
      
      const { data: createData } = await resumeAPI.create({
        ...parsedResume,
        title: `${parsedResume.personalInfo?.fullName || 'Parsed'} Resume`,
        isDraft: false
      });
      
      toast.success('Resume parsed successfully! Opening editor...');
      navigate(`/resume/${createData.resume._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to parse resume');
    } finally {
      setIsParsing(false);
      setUploadModalOpen(false);
      setUploadText('');
      setUploadFile(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFile(file);

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setUploadText(evt.target.result);
        toast.success(`Text file "${file.name}" loaded successfully!`);
      };
      reader.onerror = () => {
        toast.error('Failed to read text file');
      };
      reader.readAsText(file);
    } else {
      setUploadText(`[File loaded: ${file.name}]`);
      toast.success(`File "${file.name}" loaded! Click parse below to generate resume.`);
    }
  };

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'text-primary-600' },
    { label: 'Avg ATS Score', value: resumes.length ? Math.round(resumes.reduce((a, r) => a + (r.atsScore?.score || 0), 0) / resumes.length) : 0, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Shared', value: resumes.filter(r => r.isPublic).length, icon: Share2, color: 'text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-dark-100 bg-mesh">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-dark-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-dark-900">ResumeAI</span>
            </Link>
            
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link to="/dashboard" className="text-primary-600">Resumes</Link>
              <Link to="/cover-letters" className="text-dark-600 hover:text-dark-900">Cover Letters</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-200">
              <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-dark-900">{user?.name}</span>
            </div>
            <button onClick={logout} className="btn-ghost p-2" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-900">
              My Resumes <span className="text-gradient">✨</span>
            </h1>
            <p className="text-dark-600 mt-1">Manage and track all your professional resumes</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button onClick={() => setUploadModalOpen(true)} className="btn-secondary py-2 px-4 text-sm" id="upload-resume-btn">
              <Download className="w-4 h-4 rotate-180" /> Upload & Parse
            </button>
            <button onClick={() => navigate('/resume/new')} className="btn-primary py-2 px-4 text-sm" id="create-resume-btn">
              <Plus className="w-4 h-4" /> New Resume
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-dark-500">{stat.label}</span>
              </div>
              <span className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Resume Grid */}
        {isLoadingResumes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card h-48 skeleton" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 px-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6 border border-primary-500/20">
              <FileText className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-dark-900 mb-3">No resumes yet</h2>
            <p className="text-dark-600 max-w-sm mx-auto mb-8">
              Create your first AI-powered resume and land your dream job faster.
            </p>
            <button onClick={() => navigate('/resume/new')} className="btn-primary mx-auto" id="create-first-resume-btn">
              <Plus className="w-4 h-4" /> Create Your First Resume
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume, i) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onShare={handleShare}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Upload & Parse Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg flex flex-col shadow-2xl border border-dark-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200">
              <h2 className="font-display font-bold text-dark-900 flex items-center gap-2">
                Import Existing Resume <Sparkles className="w-4 h-4 text-primary-500" />
              </h2>
              <button onClick={() => setUploadModalOpen(false)} className="btn-ghost p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

             {/* Body */}
            <div className="p-6 space-y-4">
              <div className="text-xs text-dark-600 leading-relaxed bg-primary-500/5 border border-primary-500/10 p-3.5 rounded-2xl">
                Paste your raw resume text or load a resume file (.pdf, .docx, .txt). Gemini AI will dynamically extract your experience, projects, education, and skills.
              </div>

              <div>
                <label className="input-label">Load Resume File (PDF, DOCX, TXT)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-500/10 file:text-primary-600 hover:file:bg-primary-500/20"
                />
              </div>

              <form onSubmit={handleUploadParse} className="space-y-4 text-left">
                <div>
                  <label className="input-label">Resume Text (Paste directly)</label>
                  <textarea
                    placeholder="John Doe&#10;john@gmail.com&#10;Experience:&#10;- Software Engineer at Google (2022-2024)..."
                    value={uploadText}
                    onChange={(e) => {
                      setUploadText(e.target.value);
                      if (uploadFile) setUploadFile(null);
                    }}
                    className="input-field h-48 resize-none font-sans text-xs"
                    required={!uploadFile}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isParsing}
                  className="btn-primary w-full justify-center py-2.5 mt-2"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Parsing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Parse & Generate Resume
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
