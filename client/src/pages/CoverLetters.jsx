import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Sparkles, Copy, Trash2, Send, Save, Plus, X, Loader2, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { coverLetterAPI, resumeAPI, aiAPI } from '../api';

export default function CoverLetters() {
  const [letters, setLetters] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Creator State
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatedLetterTitle, setGeneratedLetterTitle] = useState('My Cover Letter');

  // Detail Modal State
  const [activeLetter, setActiveLetter] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLetters, resResumes] = await Promise.all([
        coverLetterAPI.getAll(),
        resumeAPI.getAll()
      ]);
      setLetters(resLetters.data.coverLetters || []);
      setResumes(resResumes.data.resumes || []);
      if (resResumes.data.resumes?.length > 0) {
        setSelectedResumeId(resResumes.data.resumes[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !company || !jobTitle) {
      return toast.error('Please select a resume and enter company/job title');
    }

    setIsGenerating(true);
    setGeneratedLetter('');
    try {
      // Get the full resume data first
      const { data: resData } = await resumeAPI.getById(selectedResumeId);
      
      // Call AI generation API
      const { data: aiData } = await aiAPI.generateCoverLetter({
        resume: resData.resume,
        jobTitle,
        company,
        jobDescription
      });

      setGeneratedLetter(aiData.content);
      setGeneratedLetterTitle(`Cover Letter — ${jobTitle} at ${company}`);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    setIsSaving(true);
    try {
      await coverLetterAPI.create({
        resumeId: selectedResumeId || null,
        title: generatedLetterTitle,
        company,
        jobTitle,
        content: generatedLetter
      });
      toast.success('Cover letter saved!');
      setCreatorOpen(false);
      // reset form
      setCompany('');
      setJobTitle('');
      setJobDescription('');
      setGeneratedLetter('');
      // refresh
      fetchData();
    } catch (err) {
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return;
    try {
      await coverLetterAPI.delete(id);
      toast.success('Deleted cover letter');
      setLetters(letters.filter(l => l._id !== id));
      if (activeLetter?._id === id) {
        setActiveLetter(null);
      }
    } catch {
      toast.error('Failed to delete cover letter');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Cover letter text copied!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const handleDownload = (letter) => {
    const blob = new Blob([letter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${letter.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Cover letter text file downloaded!');
  };

  return (
    <div className="min-h-screen bg-dark-100 bg-mesh pb-10">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-dark-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-display font-bold text-dark-900 text-sm">Cover Letters</span>
          </div>
          <button onClick={() => setCreatorOpen(true)} className="btn-primary py-2 px-4 text-sm">
            <Plus className="w-4 h-4" /> Write Cover Letter
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-600 text-xs font-semibold">Loading cover letters...</p>
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-24 px-4 bg-white border border-dark-200 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6 border border-primary-500/20">
              <FileText className="w-8 h-8 text-primary-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-dark-900 mb-2">No cover letters yet</h2>
            <p className="text-dark-600 max-w-sm mx-auto mb-8 text-sm">
              Use your resume and AI to craft the perfect, ATS-optimized cover letter matching your target jobs.
            </p>
            <button onClick={() => setCreatorOpen(true)} className="btn-primary mx-auto py-2.5">
              <Sparkles className="w-4 h-4" /> Create Your First Cover Letter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left side list */}
            <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {letters.map((letter) => (
                <div
                  key={letter._id}
                  onClick={() => setActiveLetter(letter)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 text-left
                    ${activeLetter?._id === letter._id ? 'border-primary-500 bg-primary-500/5 shadow-sm' : 'border-dark-200 bg-white hover:bg-dark-100/30'}`}
                >
                  <h3 className="font-semibold text-dark-900 text-sm truncate">{letter.company}</h3>
                  <p className="text-xs text-dark-500 font-medium truncate mt-0.5">{letter.jobTitle}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-100 text-[10px] text-dark-400">
                    <span>{new Date(letter.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(letter._id); }}
                      className="p-1 rounded text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side reader */}
            <div className="md:col-span-2">
              {activeLetter ? (
                <div className="card space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-dark-200">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-dark-900 truncate">{activeLetter.title}</h2>
                      <p className="text-xs text-dark-500 mt-1">Company: <strong>{activeLetter.company}</strong> · Job: <strong>{activeLetter.jobTitle}</strong></p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleCopy(activeLetter.content)} className="btn-ghost p-2" title="Copy text">
                        <Copy className="w-4.5 h-4.5" />
                      </button>
                      <button onClick={() => handleDownload(activeLetter)} className="btn-ghost p-2" title="Download text file">
                        <Download className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-pre-line text-sm text-dark-700 leading-relaxed font-sans text-left max-h-[50vh] overflow-y-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    {activeLetter.content}
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-dark-200 rounded-3xl flex items-center justify-center text-dark-500 text-sm">
                  Select a cover letter from the list to view it
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Creator Modal */}
      {creatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl border border-dark-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200">
              <h2 className="font-display font-bold text-dark-900 flex items-center gap-2">
                AI Cover Letter Generator <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
              </h2>
              <button onClick={() => setCreatorOpen(false)} className="btn-ghost p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!generatedLetter ? (
                <form onSubmit={handleGenerate} className="space-y-4 text-left">
                  <div>
                    <label className="input-label">Select Source Resume</label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="input-field"
                      required
                    >
                      {resumes.map(r => (
                        <option key={r._id} value={r._id}>{r.title} ({r.personalInfo?.fullName || 'No Name'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Company Name</label>
                      <input
                        type="text"
                        placeholder="Google, Stripe, etc."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Job Title</label>
                      <input
                        type="text"
                        placeholder="Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Job Description (Paste raw text)</label>
                    <textarea
                      placeholder="Paste the job description keywords, qualifications, and scope to optimize letter matching..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="input-field h-32 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary w-full justify-center py-3 mt-4"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating letter with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Custom Cover Letter
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="input-label">Document Title</label>
                    <input
                      type="text"
                      value={generatedLetterTitle}
                      onChange={(e) => setGeneratedLetterTitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="input-label">Generated Content</label>
                    <textarea
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      className="input-field h-64 resize-none font-sans text-sm leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setGeneratedLetter('')}
                      className="btn-secondary flex-1 justify-center py-2.5"
                    >
                      Back / Rewrite
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary flex-1 justify-center py-2.5"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
