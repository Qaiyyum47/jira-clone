const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  issueKey: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
    required: true,
  },

  issueCount: {
    type: Number,
    default: 0,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue', 
    },
  ],
  kanbanStatuses: {
    type: [String],
    default: ['To Do', 'In Progress', 'Done'],
  },
  color: {
    type: String,
    default: '#000000', 
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;