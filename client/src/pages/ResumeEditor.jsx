import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Eye, ArrowLeft, Sparkles, CheckCircle2, Circle, ChevronRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import useResumeStore, { defaultResumeData } from '../store/resumeStore';
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

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const autoSaveTimer = useRef(null);
  const [viewMode, setViewMode] = useState('edit');
  const {
    currentResume, resumeId, activeStep, isDirty, isSaving,
    setCurrentResume, setActiveStep, setSaving, setSaved, resetEditor
  } = useResumeStore();

  // Load resume if editing
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

  // Auto-save every 30 seconds when dirty
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
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-semibold text-dark-900 text-sm">
                {currentResume.title || 'Untitled Resume'}
              </h1>
              {isDirty && <span className="text-xs text-yellow-500 font-medium">Unsaved changes</span>}
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
        <div className="w-full h-0.5 bg-dark-200">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Left sidebar steps */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-dark-200 py-6 px-3 gap-1">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                ${i === activeStep ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' :
                  i < activeStep ? 'text-green-600 hover:bg-dark-200/50' : 'text-dark-600 hover:bg-dark-200/50 hover:text-dark-900'}`}
            >
              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                {i < activeStep
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-xs
                      ${i === activeStep ? 'border-primary-500 bg-primary-500/10 text-primary-600' : 'border-dark-300 text-dark-500'}`}>
                      {i + 1}
                    </span>
                }
              </span>
              {step.label}
            </button>
          ))}
        </aside>

        {/* Main form area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* View Mode Toggle for Mobile/Tablet (< xl) */}
            <div className="flex xl:hidden justify-center mb-6">
              <div className="bg-dark-200 border border-dark-300 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'edit' ? 'bg-primary-500 text-white shadow-glow' : 'text-dark-600 hover:text-dark-900'}`}
                >
                  Edit Form
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'preview' ? 'bg-primary-500 text-white shadow-glow' : 'text-dark-600 hover:text-dark-900'}`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Mobile step indicator */}
            {viewMode === 'edit' && (
              <div className="flex items-center gap-2 mb-6 lg:hidden overflow-x-auto no-scrollbar pb-2">
                {STEPS.map((step, i) => (
                  <button key={step.id} onClick={() => setActiveStep(i)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${i === activeStep ? 'bg-primary-500 text-white' :
                        i < activeStep ? 'bg-green-500/10 text-green-600' : 'bg-dark-200 text-dark-500'}`}>
                    {step.shortLabel}
                  </button>
                ))}
              </div>
            )}

            {/* Form View */}
            <div className={viewMode === 'preview' ? 'xl:block hidden' : ''}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <CurrentStep />
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

            {/* Navigation buttons */}
            {viewMode === 'edit' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-200">
                <button onClick={handleBack} disabled={activeStep === 0}
                  className="btn-secondary" id="step-back-btn">
                  Back
                </button>
                <span className="text-sm text-dark-500">{activeStep + 1} / {STEPS.length}</span>
                {activeStep < STEPS.length - 1 ? (
                  <button onClick={handleNext} className="btn-primary" id="step-next-btn">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={isSaving} className="btn-primary" id="step-finish-btn">
                    {isSaving ? 'Saving...' : 'Finish & Save ✓'}
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Right live preview panel */}
        <aside className="hidden xl:block w-[420px] shrink-0 border-l border-dark-200 overflow-y-auto">
          <div className="sticky top-0 p-3 border-b border-dark-200 flex items-center justify-between">
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
