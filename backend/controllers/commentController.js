const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const Project = require('../models/Project');


const createComment = async (req, res) => {
  const { text } = req.body;
  const { issueId } = req.params;

  try {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }

    const comment = await Comment.create({
      issue: issueId,
      user: req.user._id,
      text,
    });

    issue.comments.push(comment._id);
    await issue.save();

    const populatedComment = await comment.populate('user', 'name email profilePicture');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getComments = async (req, res) => {
  const { issueId } = req.params;

  try {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }

    const comments = await Comment.find({ issue: issueId })
      .populate('user', 'name email');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateComment = async (req, res) => {
  const { text } = req.body;
  const { issueId, commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    const issue = await Issue.findById(issueId).populate('project', 'owner'); 

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }
    if (comment.issue.toString() !== issueId.toString()) {
      res.status(400).json({ message: 'Comment does not belong to this issue' });
      return;
    }

    
    const isCommentOwner = comment.user.toString() === req.user._id.toString();
    const isProjectOwner = issue.project.owner.toString() === req.user._id.toString();

    if (!isCommentOwner && !isProjectOwner) {
      res.status(403).json({ message: 'Not authorized to update this comment' });
      return;
    }

    comment.text = text || comment.text;

    const updatedComment = await comment.save();
    const populatedComment = await updatedComment.populate('user', 'name email profilePicture'); 

    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteComment = async (req, res) => {
  const { issueId, commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    const issue = await Issue.findById(issueId).populate('project', 'owner'); 

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }
    if (comment.issue.toString() !== issueId.toString()) {
      res.status(400).json({ message: 'Comment does not belong to this issue' });
      return;
    }

    
    const isCommentOwner = comment.user.toString() === req.user._id.toString();
    const isProjectOwner = issue.project.owner.toString() === req.user._id.toString();

    if (!isCommentOwner && !isProjectOwner) {
      res.status(403).json({ message: 'Not authorized to delete this comment' });
      return;
    }

    await comment.deleteOne();

    
    issue.comments = issue.comments.filter((cId) => cId.toString() !== commentId.toString());
    await issue.save();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};