const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const spaceController = require('../controllers/spaceController');

router.route('/')
  .post(protect, spaceController.createSpace)
  .get(protect, spaceController.getSpaces);

router.route('/:id')
  .get(protect, spaceController.getSpaceById)
  .put(protect, spaceController.updateSpace)
  .delete(protect, spaceController.deleteSpace);

router.route('/:id/members')
  .post(protect, spaceController.addMemberToSpace)
  .get(protect, spaceController.getSpaceMembers);

router.route('/:id/members/:memberId')
  .delete(protect, spaceController.removeMemberFromSpace);

router.route('/:id/issues')
  .get(protect, spaceController.getIssuesBySpace);

module.exports = router;
