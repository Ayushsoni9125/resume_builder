const Resume = require('../models/Resume');

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('title template atsScore isDraft createdAt updatedAt personalInfo.fullName')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('🔴 createResume Error:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public resume by shareId
// @route   GET /api/resumes/shared/:shareId
// @access  Public
const getSharedResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareId: req.params.shareId, isPublic: true });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found or not public' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auto-save resume (partial update, no version history)
// @route   PATCH /api/resumes/:id/autosave
// @access  Private
const autoSaveResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, lastAutoSaved: new Date(), isDraft: true },
      { new: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, message: 'Auto-saved', lastAutoSaved: resume.lastAutoSaved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!original) return res.status(404).json({ success: false, message: 'Resume not found' });

    const data = original.toObject();
    delete data._id;
    delete data.shareId;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.versions;
    data.title = `${data.title} (Copy)`;
    data.isPublic = false;
    data.isDraft = false;

    const duplicate = await Resume.create(data);
    res.status(201).json({ success: true, resume: duplicate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save version snapshot
// @route   POST /api/resumes/:id/versions
// @access  Private
const saveVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const versionNumber = (resume.versions.length || 0) + 1;
    const snapshot = resume.toObject();
    delete snapshot.versions;

    resume.versions.push({
      versionNumber,
      data: snapshot,
      label: req.body.label || `Version ${versionNumber}`,
      savedAt: new Date()
    });

    // Keep only last 10 versions
    if (resume.versions.length > 10) {
      resume.versions = resume.versions.slice(-10);
    }

    await resume.save();
    res.json({ success: true, message: 'Version saved', versionNumber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restore version
// @route   POST /api/resumes/:id/versions/:versionId/restore
// @access  Private
const restoreVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const version = resume.versions.id(req.params.versionId);
    if (!version) return res.status(404).json({ success: false, message: 'Version not found' });

    const restoredData = version.data;
    delete restoredData._id;
    delete restoredData.versions;

    Object.assign(resume, restoredData);
    await resume.save();

    res.json({ success: true, message: 'Version restored', resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle public sharing
// @route   PATCH /api/resumes/:id/share
// @access  Private
const toggleShare = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    resume.isPublic = !resume.isPublic;
    await resume.save();

    res.json({
      success: true,
      isPublic: resume.isPublic,
      shareId: resume.shareId,
      shareUrl: resume.isPublic ? `${process.env.CLIENT_URL}/r/${resume.shareId}` : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResumes, createResume, getResume, getSharedResume,
  updateResume, autoSaveResume, deleteResume, duplicateResume,
  saveVersion, restoreVersion, toggleShare
};
