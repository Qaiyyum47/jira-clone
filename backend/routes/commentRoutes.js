const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/issues/:issueId/comments')
  .post(protect, createComment)
  .get(protect, getComments);

router.route('/issues/:issueId/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;