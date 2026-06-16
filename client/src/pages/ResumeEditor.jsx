import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Eye, ArrowLeft, Sparkles, CheckCircle2, ChevronRight, Loader2, History, TrendingUp, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore from '../store/resumeStore';
import { resumeAPI, aiAPI } from '../api';

// Step components
import PersonalInfoStep from '../components/resume/PersonalInfoStep';
import SummaryStep from '../components/resume/SummaryStep';
import EducationStep from '../components/resume/EducationStep';
import ExperienceStep from '../components/resume/ExperienceStep';
import ProjectsStep from '../components/resume/ProjectsStep';
import SkillsStep from '../components/resume/SkillsStep';
import CertificationsStep from '../components/resume/CertificationsStep';
import TemplateStep from '../components/resume/TemplateStep';
import ResumePreviewPanel from '../components/resume/ResumePreviewPanel';

const STEPS = [
  { id: 'personal', label: 'Personal Info', shortLabel: 'Info' },
  { id: 'summary', label: 'Summary', shortLabel: 'Summary' },
  { id: 'education', label: 'Education', shortLabel: 'Education' },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certs' },
  { id: 'template', label: 'Template', shortLabel: 'Template' },
];

function ATSJobMatcher({ resume }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const handleRunMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return toast.error('Please paste a job description');
    setLoading(true);
    try {
      const { data } = await aiAPI.matchJobDescription(resume, jobDescription);
      setMatchData(data.matchData);
      toast.success('ATS Match analysis complete!');
    } catch {
      toast.error('Failed to complete ATS matching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title text-left">ATS Job Description Matcher</h2>
        <p className="section-subtitle text-left">Paste a target job description to analyze skills compatibility and missing keywords</p>
      </div>

      <div className="card space-y-4 text-left">
        <form onSubmit={handleRunMatch} className="space-y-4">
          <div>
            <label className="input-label">Job Description</label>
            <textarea
              placeholder="Paste job requirements, desired tech stack, and qualifications here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-field h-40 resize-none font-sans text-xs"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Match...</> : <><Sparkles className="w-4 h-4" /> Run ATS Match Analysis</>}
          </button>
        </form>

        {matchData && (
          <div className="space-y-6 pt-4 border-t border-dark-200">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={matchData.score >= 80 ? '#22c55e' : matchData.score >= 65 ? '#f59e0b' : '#ef4444'} strokeWidth="8"
                    strokeDasharray={`${(matchData.score / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-bold" style={{ color: matchData.score >= 80 ? '#22c55e' : matchData.score >= 65 ? '#f59e0b' : '#ef4444' }}>{matchData.score}%</span>
              </div>
              <div>
                <h3 className="font-bold text-dark-900 text-sm">ATS Compatibility Score</h3>
                <p className="text-xs text-dark-600 leading-relaxed mt-1">{matchData.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-green-600 uppercase tracking-wider">Matched Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.matchedKeywords?.length > 0 ? (
                    matchData.matchedKeywords.map(k => <span key={k} className="badge-success text-[10px]">{k}</span>)
                  ) : <span className="text-xs text-dark-500">No matching keywords found</span>}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-red-500 uppercase tracking-wider">Missing Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.missingKeywords?.length > 0 ? (
                    matchData.missingKeywords.map(k => <span key={k} className="badge bg-red-50 text-red-600 border border-red-100 text-[10px]">{k}</span>)
                  ) : <span className="text-xs text-green-600">No missing keywords!</span>}
                </div>
              </div>
            </div>

            {matchData.recommendations?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-dark-900 uppercase tracking-wider">Recommendations for Alignment</h4>
                <ul className="space-y-1.5 text-xs text-dark-600 leading-relaxed">
                  {matchData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                      <span className="text-primary-500 font-bold shrink-0">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VersionHistory({ resumeId, currentResume, onRestoreSuccess }) {
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState(currentResume.versions || []);

  const handleSaveSnapshot = async (e) => {
    e.preventDefault();
    if (!resumeId) return toast.error('Save your resume first to capture snapshots!');
    
    setSaving(true);
    try {
      await resumeAPI.saveVersion(resumeId, label);
      toast.success('Resume version snapshot captured!');
      setLabel('');
      const { data } = await resumeAPI.getById(resumeId);
      setVersions(data.resume.versions || []);
    } catch {
      toast.error('Failed to capture snapshot');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!confirm('Are you sure you want to restore this version? Your unsaved changes in the editor will be replaced!')) return;
    try {
      const { data } = await resumeAPI.restoreVersion(resumeId, versionId);
      onRestoreSuccess(data.resume);
      setVersions(data.resume.versions || []);
      toast.success('Snapshot restored successfully!');
    } catch {
      toast.error('Failed to restore snapshot');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title text-left">Resume Version History</h2>
        <p className="section-subtitle text-left">Save manual snapshot restore points and switch between edits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-left">
        <div className="md:col-span-1 card space-y-4">
          <h3 className="font-bold text-dark-900 text-sm">Save Snapshot</h3>
          <p className="text-xs text-dark-600 leading-relaxed font-medium">Create a safe restore point before applying major edits or AI suggestions.</p>
          
          <form onSubmit={handleSaveSnapshot} className="space-y-3">
            <input
              type="text"
              placeholder="e.g., Before AI updates"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit" disabled={saving || !resumeId} className="btn-primary w-full justify-center text-xs py-2.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Capture Snapshot
            </button>
            {!resumeId && <p className="text-[10px] text-yellow-600 font-semibold mt-1">⚠️ Save resume once to enable snapshots</p>}
          </form>
        </div>

        <div className="md:col-span-2 card space-y-4">
          <h3 className="font-bold text-dark-900 text-sm">Saved Snapshots ({versions.length}/10)</h3>
          
          {versions.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-dark-200 rounded-2xl text-dark-500 text-xs">
              No version snapshots saved yet
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {versions.map((ver) => (
                <div key={ver._id} className="p-3 border border-dark-200 rounded-xl flex items-center justify-between hover:bg-dark-100/30 transition-all">
                  <div>
                    <h4 className="font-bold text-dark-900 text-xs">{ver.label}</h4>
                    <p className="text-[10px] text-dark-400 mt-1">Saved on {new Date(ver.savedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleRestore(ver._id)}
                    className="btn-ghost text-xs px-3 py-1.5 bg-primary-500/10 text-primary-600 border border-primary-500/20 hover:bg-primary-500 hover:text-white"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const autoSaveTimer = useRef(null);
  const [viewMode, setViewMode] = useState('edit');
  const [currentTab, setCurrentTab] = useState('form'); // 'form' | 'ats' | 'versions'
  
  const {
    currentResume, resumeId, activeStep, isDirty, isSaving,
    setCurrentResume, setActiveStep, setSaving, setSaved, resetEditor
  } = useResumeStore();

  useEffect(() => {
    if (id) {
      resumeAPI.getById(id)
        .then(({ data }) => setCurrentResume(data.resume))
        .catch(() => { toast.error('Resume not found'); navigate('/dashboard'); });
    } else {
      resetEditor();
    }
    return () => clearTimeout(autoSaveTimer.current);
  }, [id]);

  useEffect(() => {
    if (!isDirty || !resumeId) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await resumeAPI.autoSave(resumeId, currentResume);
        setSaved();
        toast('Auto-saved ✓', { icon: '💾', duration: 1500 });
      } catch { /* silent */ }
    }, 30000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [isDirty, currentResume]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (resumeId) {
        await resumeAPI.update(resumeId, currentResume);
      } else {
        const { data } = await resumeAPI.create({ ...currentResume, isDraft: false });
        setCurrentResume(data.resume);
        navigate(`/resume/${data.resume._id}/edit`, { replace: true });
      }
      setSaved();
      toast.success('Resume saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  const handleNext = () => activeStep < STEPS.length - 1 && setActiveStep(activeStep + 1);
  const handleBack = () => activeStep > 0 && setActiveStep(activeStep - 1);

  const stepComponents = [
    PersonalInfoStep, SummaryStep, EducationStep, ExperienceStep,
    ProjectsStep, SkillsStep, CertificationsStep, TemplateStep
  ];
  const CurrentStep = stepComponents[activeStep];

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-dark-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-semibold text-dark-900 text-sm">
                {currentResume.title || 'Untitled Resume'}
              </h1>
              {isDirty && <span className="text-xs text-orange-500 font-medium">Unsaved changes</span>}
              {!isDirty && isSaving === false && resumeId && (
                <span className="text-xs text-green-600 font-medium">All changes saved</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resumeId && (
              <Link to={`/resume/${resumeId}/preview`}
                className="btn-ghost gap-2 text-sm hidden sm:flex" id="preview-btn">
                <Eye className="w-4 h-4" /> Preview
              </Link>
            )}
            <button onClick={handleSave} disabled={isSaving} className="btn-primary py-2 px-4 text-sm" id="save-resume-btn">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Step progress bar */}
        {currentTab === 'form' && (
          <div className="w-full h-0.5 bg-dark-200">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        )}
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full overflow-hidden">
        {/* Left sidebar steps & tools */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-dark-200 py-6 px-3 gap-1 overflow-y-auto">
          <span className="text-[10px] font-bold text-dark-400 uppercase px-3 mb-2 tracking-widest">BUILD STEPS</span>
          
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => { setCurrentTab('form'); setActiveStep(i); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                ${i === activeStep && currentTab === 'form' ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' :
                  i < activeStep && currentTab === 'form' ? 'text-green-600 hover:bg-dark-200/50' : 'text-dark-600 hover:bg-dark-200/50 hover:text-dark-900'}`}
            >
              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                {i < activeStep
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-xs
                      ${i === activeStep && currentTab === 'form' ? 'border-primary-500 bg-primary-500/10 text-primary-600' : 'border-dark-300 text-dark-500'}`}>
                      {i + 1}
                    </span>
                }
              </span>
              {step.label}
            </button>
          ))}

          <div className="h-px bg-dark-200 my-4" />
          <span className="text-[10px] font-bold text-dark-400 uppercase px-3 mb-2 tracking-widest">AI UTILITIES</span>

          <button
            onClick={() => setCurrentTab('ats')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
              ${currentTab === 'ats' ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' : 'text-dark-600 hover:bg-dark-200/50 hover:text-dark-900'}`}
          >
            <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
            ATS Job Matcher
          </button>

          <button
            onClick={() => setCurrentTab('versions')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
              ${currentTab === 'versions' ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' : 'text-dark-600 hover:bg-dark-200/50 hover:text-dark-900'}`}
          >
            <History className="w-4 h-4 text-blue-500 shrink-0" />
            Version History
          </button>
        </aside>

        {/* Main form/tool area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* View Mode Toggle for Mobile/Tablet */}
            <div className="flex xl:hidden justify-center mb-6">
              <div className="bg-dark-200 border border-dark-300 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'edit' ? 'bg-primary-500 text-white shadow-glow' : 'text-dark-600 hover:text-dark-900'}`}
                >
                  Edit Panel
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'preview' ? 'bg-primary-500 text-white shadow-glow' : 'text-dark-600 hover:text-dark-900'}`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Mobile step indicators */}
            {viewMode === 'edit' && (
              <div className="flex items-center gap-2 mb-6 lg:hidden overflow-x-auto no-scrollbar pb-2">
                <button
                  onClick={() => setCurrentTab('form')}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${currentTab === 'form' ? 'bg-primary-500 text-white' : 'bg-dark-200 text-dark-500'}`}
                >
                  Steps
                </button>
                <button
                  onClick={() => setCurrentTab('ats')}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${currentTab === 'ats' ? 'bg-orange-500 text-white' : 'bg-dark-200 text-dark-500'}`}
                >
                  ATS Matcher
                </button>
                <button
                  onClick={() => setCurrentTab('versions')}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${currentTab === 'versions' ? 'bg-blue-500 text-white' : 'bg-dark-200 text-dark-500'}`}
                >
                  Versions
                </button>
              </div>
            )}

            {/* Mobile form step sub-navigation */}
            {viewMode === 'edit' && currentTab === 'form' && (
              <div className="flex items-center gap-2 mb-6 lg:hidden overflow-x-auto no-scrollbar pb-2">
                {STEPS.map((step, i) => (
                  <button key={step.id} onClick={() => setActiveStep(i)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-medium transition-all
                      ${i === activeStep ? 'bg-primary-500/10 text-primary-600 border border-primary-500/30' : 'bg-dark-200 text-dark-500'}`}>
                    {step.shortLabel}
                  </button>
                ))}
              </div>
            )}

            {/* Form View / ATS View / Versions View */}
            <div className={viewMode === 'preview' ? 'xl:block hidden' : ''}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab === 'form' ? activeStep : currentTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentTab === 'form' && <CurrentStep />}
                  {currentTab === 'ats' && <ATSJobMatcher resume={currentResume} />}
                  {currentTab === 'versions' && <VersionHistory resumeId={resumeId} currentResume={currentResume} onRestoreSuccess={setCurrentResume} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Live Preview Wrapper */}
            {viewMode === 'preview' && (
              <div className="xl:hidden block space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-dark-500 uppercase tracking-wider">Live Preview</span>
                  {resumeId && (
                    <Link to={`/resume/${resumeId}/preview`} className="btn-primary py-1.5 px-3 text-xs">
                      Full Preview & PDF
                    </Link>
                  )}
                </div>
                <div className="bg-white border border-dark-200 rounded-2xl p-4 flex justify-center overflow-x-auto no-scrollbar">
                  <ResumePreviewPanel />
                </div>
              </div>
            )}

            {/* Navigation buttons for editing steps */}
            {viewMode === 'edit' && currentTab === 'form' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-200">
                <button onClick={handleBack} disabled={activeStep === 0}
                  className="btn-secondary text-xs" id="step-back-btn">
                  Back
                </button>
                <span className="text-xs text-dark-500 font-semibold">{activeStep + 1} / {STEPS.length}</span>
                {activeStep < STEPS.length - 1 ? (
                  <button onClick={handleNext} className="btn-primary text-xs py-2.5" id="step-next-btn">
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={isSaving} className="btn-primary text-xs py-2.5" id="step-finish-btn">
                    {isSaving ? 'Saving...' : 'Finish & Save ✓'}
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Right live preview panel */}
        <aside className="hidden xl:block w-[420px] shrink-0 border-l border-dark-200 overflow-y-auto">
          <div className="sticky top-0 p-3 border-b border-dark-200 flex items-center justify-between bg-white/95 backdrop-blur-sm z-10">
            <span className="text-xs font-medium text-dark-500 uppercase tracking-wider">Live Preview</span>
            {resumeId && (
              <Link to={`/resume/${resumeId}/preview`} className="btn-ghost py-1 px-2 text-xs">
                Full Preview
              </Link>
            )}
          </div>
          <div className="p-4">
            <ResumePreviewPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
