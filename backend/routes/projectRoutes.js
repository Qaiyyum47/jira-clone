const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  updateKanbanStatuses,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/kanban')
  .put(protect, updateKanbanStatuses);

router.route('/:id/members')
  .put(protect, addMemberToProject);

router.route('/:id/members/:userId')
  .delete(protect, removeMemberFromProject);

module.exports = router;