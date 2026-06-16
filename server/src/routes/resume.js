const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getResumes, createResume, getResume, getSharedResume,
  updateResume, autoSaveResume, deleteResume, duplicateResume,
  saveVersion, restoreVersion, toggleShare
} = require('../controllers/resumeController');

// Public route
router.get('/shared/:shareId', getSharedResume);

// Protected routes
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.patch('/:id/autosave', autoSaveResume);
router.post('/:id/duplicate', duplicateResume);
router.patch('/:id/share', toggleShare);
router.post('/:id/versions', saveVersion);
router.post('/:id/versions/:versionId/restore', restoreVersion);

module.exports = router;
