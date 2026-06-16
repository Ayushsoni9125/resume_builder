const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCoverLetters,
  getCoverLetter,
  createCoverLetter,
  deleteCoverLetter
} = require('../controllers/coverLetterController');

// All cover letter routes are protected
router.use(protect);

router.route('/')
  .get(getCoverLetters)
  .post(createCoverLetter);

router.route('/:id')
  .get(getCoverLetter)
  .delete(deleteCoverLetter);

module.exports = router;
