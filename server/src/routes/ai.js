const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateSummary,
  generateProjectDescription,
  suggestSkills,
  generateImprovements,
  calculateATSScore,
  generateExperienceDescription,
  importSocials,
  parseResume,
  matchJobDescription,
  rewriteSection,
  generateCoverLetter
} = require('../controllers/aiController');

// All AI routes are protected
router.use(protect);

router.post('/summary', generateSummary);
router.post('/project-description', generateProjectDescription);
router.post('/skill-suggestions', suggestSkills);
router.post('/improve', generateImprovements);
router.post('/ats-score', calculateATSScore);
router.post('/experience-description', generateExperienceDescription);
router.post('/import-socials', importSocials);
router.post('/parse', parseResume);
router.post('/job-match', matchJobDescription);
router.post('/rewrite', rewriteSection);
router.post('/generate-cover-letter', generateCoverLetter);

module.exports = router;
