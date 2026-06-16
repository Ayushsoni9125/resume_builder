const CoverLetter = require('../models/CoverLetter');

// @desc    Get all cover letters for user
// @route   GET /api/cover-letters
// @access  Private
const getCoverLetters = async (req, res) => {
  try {
    const letters = await CoverLetter.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: letters.length, coverLetters: letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single cover letter
// @route   GET /api/cover-letters/:id
// @access  Private
const getCoverLetter = async (req, res) => {
  try {
    const letter = await CoverLetter.findOne({ _id: req.params.id, userId: req.user._id });
    if (!letter) return res.status(404).json({ success: false, message: 'Cover letter not found' });
    res.json({ success: true, coverLetter: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Save cover letter
// @route   POST /api/cover-letters
// @access  Private
const createCoverLetter = async (req, res) => {
  try {
    const letter = await CoverLetter.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, coverLetter: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete cover letter
// @route   DELETE /api/cover-letters/:id
// @access  Private
const deleteCoverLetter = async (req, res) => {
  try {
    const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!letter) return res.status(404).json({ success: false, message: 'Cover letter not found' });
    res.json({ success: true, message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCoverLetters,
  getCoverLetter,
  createCoverLetter,
  deleteCoverLetter
};
