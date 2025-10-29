const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getAllIssues,
  getSidebarIssues,
  searchIssues,
  getIssueSuggestions,
  addAttachment,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const multerUpload = require('../middleware/uploadMiddleware');

router.route('/issues/sidebar').get(protect, getSidebarIssues);

router.route('/issues/search').get(protect, searchIssues);
router.route('/issues/suggestions').get(protect, getIssueSuggestions);

router.route('/issues')
  .get(protect, getAllIssues);

router.route('/spaces/:spaceId/issues')
  .post(protect, createIssue)
  .get(protect, getIssues);

router.route('/issues/:issueId')
  .get(protect, getIssueById)
  .put(protect, updateIssue)
  .delete(protect, deleteIssue);

router.route('/issues/:issueId/attachments').post(protect, multerUpload.single('attachment'), addAttachment);

module.exports = router;