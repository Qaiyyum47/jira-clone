const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true,
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  team: {
    type: String,
    enum: ['UI/UX', 'Frontend', 'Backend', 'DevOps', 'QA', 'Other'],
  },
  dueDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  attachments: [
    {
      type: String,
    },
  ],
}, {
  timestamps: true,
});

issueSchema.index({ title: 'text', description: 'text' });

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;