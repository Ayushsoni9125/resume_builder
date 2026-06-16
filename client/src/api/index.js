import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

export const resumeAPI = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  getShared: (shareId) => api.get(`/resumes/shared/${shareId}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  autoSave: (id, data) => api.patch(`/resumes/${id}/autosave`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
  toggleShare: (id) => api.patch(`/resumes/${id}/share`),
  saveVersion: (id, label) => api.post(`/resumes/${id}/versions`, { label }),
  restoreVersion: (id, versionId) => api.post(`/resumes/${id}/versions/${versionId}/restore`),
};

export const aiAPI = {
  generateSummary: (data) => api.post('/ai/summary', data),
  generateProjectDesc: (data) => api.post('/ai/project-description', data),
  suggestSkills: (data) => api.post('/ai/skill-suggestions', data),
  generateImprovements: (data) => api.post('/ai/improve', data),
  calculateATS: (data) => api.post('/ai/ats-score', data),
  generateExperienceDesc: (data) => api.post('/ai/experience-description', data),
  importSocials: (data) => api.post('/ai/import-socials', data),
  parseResume: (text) => api.post('/ai/parse', { text }),
  parseResumeFile: (formData) => api.post('/ai/parse-file', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  matchJobDescription: (resume, jobDescription) => api.post('/ai/job-match', { resume, jobDescription }),
  rewriteSection: (text, option) => api.post('/ai/rewrite', { text, option }),
  generateCoverLetter: (data) => api.post('/ai/generate-cover-letter', data),
};

export const coverLetterAPI = {
  getAll: () => api.get('/cover-letters'),
  getById: (id) => api.get(`/cover-letters/${id}`),
  create: (data) => api.post('/cover-letters', data),
  delete: (id) => api.delete(`/cover-letters/${id}`),
};
