import { create } from 'zustand';

export const defaultResumeData = {
  title: 'My Resume',
  template: 'modern-professional',
  themeColor: '#6C47FF',
  personalInfo: {
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', github: '', portfolio: '', photo: ''
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { technical: [], soft: [] },
  certifications: [],
  achievements: [],
  sectionOrder: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements'],
};

const useResumeStore = create((set, get) => ({
  // Current resume being edited
  currentResume: { ...defaultResumeData },
  resumeId: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,

  // All user resumes list
  resumes: [],
  isLoadingResumes: false,

  // UI state
  activeStep: 0,
  activeTemplate: 'modern-professional',
  isPreviewMode: false,
  previewZoom: 0.6,

  // Set entire resume
  setCurrentResume: (resume) => set({
    currentResume: resume,
    resumeId: resume._id,
    activeTemplate: resume.template,
    isDirty: false,
  }),

  // Update a top-level section
  updateSection: (section, data) => set((state) => ({
    currentResume: { ...state.currentResume, [section]: data },
    isDirty: true,
  })),

  // Update personalInfo fields
  updatePersonalInfo: (field, value) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      personalInfo: { ...state.currentResume.personalInfo, [field]: value }
    },
    isDirty: true,
  })),

  // Update skills
  updateSkills: (type, skills) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      skills: { ...state.currentResume.skills, [type]: skills }
    },
    isDirty: true,
  })),

  // Array section helpers
  addItem: (section, item) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      [section]: [...(state.currentResume[section] || []), item]
    },
    isDirty: true,
  })),

  updateItem: (section, index, data) => set((state) => {
    const arr = [...(state.currentResume[section] || [])];
    arr[index] = { ...arr[index], ...data };
    return { currentResume: { ...state.currentResume, [section]: arr }, isDirty: true };
  }),

  removeItem: (section, index) => set((state) => {
    const arr = [...(state.currentResume[section] || [])];
    arr.splice(index, 1);
    return { currentResume: { ...state.currentResume, [section]: arr }, isDirty: true };
  }),

  reorderItems: (section, items) => set((state) => ({
    currentResume: { ...state.currentResume, [section]: items },
    isDirty: true,
  })),

  reorderSections: (newOrder) => set((state) => ({
    currentResume: { ...state.currentResume, sectionOrder: newOrder },
    isDirty: true,
  })),

  // Template & color
  setTemplate: (template) => set((state) => ({
    currentResume: { ...state.currentResume, template },
    activeTemplate: template,
    isDirty: true,
  })),

  setThemeColor: (color) => set((state) => ({
    currentResume: { ...state.currentResume, themeColor: color },
    isDirty: true,
  })),

  // Navigation
  setActiveStep: (step) => set({ activeStep: step }),

  // Preview
  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  setPreviewZoom: (zoom) => set({ previewZoom: zoom }),

  // Save states
  setSaving: (val) => set({ isSaving: val }),
  setSaved: () => set({ isDirty: false, lastSaved: new Date(), isSaving: false }),

  // Resume list
  setResumes: (resumes) => set({ resumes }),
  setLoadingResumes: (val) => set({ isLoadingResumes: val }),

  removeResume: (id) => set((state) => ({
    resumes: state.resumes.filter(r => r._id !== id)
  })),

  // Reset editor
  resetEditor: () => set({
    currentResume: { ...defaultResumeData },
    resumeId: null,
    isDirty: false,
    activeStep: 0,
    activeTemplate: 'modern-professional',
  }),
}));

export default useResumeStore;
