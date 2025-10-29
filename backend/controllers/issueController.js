const Issue = require('../models/Issue');
const Space = require('../models/Space');


const createIssue = async (req, res) => {
  const { title, description, status, priority, assignee, dueDate, team, reporter, projectId } = req.body;
  const { spaceId } = req.params;

  try {
    if (!projectId) {
      res.status(400).json({ message: 'Project ID is required to create an issue.' });
      return;
    }

    let space = await Space.findById(spaceId);

    if (!space) {
      res.status(404).json({ message: 'Space not found' });
      return;
    }

    
    const isMember = space.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (space.owner.toString() !== req.user._id.toString() && !isMember) {
      res.status(403).json({ message: 'Not authorized to create issues in this space' });
      return;
    }

    
    space = await Space.findByIdAndUpdate(
      spaceId,
      { $inc: { issueCount: 1 } },
      { new: true }
    );

    const currentSpaceKey = space.spaceKey || 'UNK'; 
    const generatedIssueId = `${currentSpaceKey}-${String(space.issueCount).padStart(3, '0')}`;

    const issue = await Issue.create({
      issueId: generatedIssueId, 
      space: spaceId,
      project: projectId, 
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      team: team || null,
      dueDate,
      createdBy: req.user._id,
      reporter: reporter || req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    
    if (error.code === 11000) {
      res.status(400).json({ message: `Issue ID '${req.body.issueTicket}' already exists. Please choose a different one.` });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};


const getIssues = async (req, res) => {
  const { spaceId } = req.params;
  const { projectId } = req.query; 

  try {
    const space = await Space.findById(spaceId);

    if (!space) {
      res.status(404).json({ message: 'Space not found' });
      return;
    }

    
    const isMember = space.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (space.owner.toString() !== req.user._id.toString() && !isMember) {
      res.status(403).json({ message: 'Not authorized to view issues in this space' });
      return;
    }

    let query = { space: spaceId };
    if (projectId) {
      query.project = projectId;
    }

    const issues = await Issue.find(query)
      .populate({
        path: 'project',
        select: 'name issueKey color',
        populate: {
          path: 'space',
          select: 'name' 
        }
      })
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email')
      .populate('reporter', 'name email');

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findOne({ issueId: req.params.issueId })
      .populate('space', 'name owner members spaceKey')
      .populate('project', 'name issueKey color')
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email')
      .populate('reporter', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email profilePicture' }
      });

    if (issue) {
      
      const isMember = issue.space.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      );

      if (issue.space.owner.toString() === req.user._id.toString() || isMember) {
        res.json(issue);
      } else {
        res.status(403).json({ message: 'Not authorized to access this issue' });
      }
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateIssue = async (req, res) => {
  const { title, description, status, priority, assignee, dueDate, team, reporter } = req.body;

  try {
    const issue = await Issue.findById(req.params.issueId).populate('space', 'owner members spaceKey').populate('project', 'name issueKey');

    if (issue) {
      
      const isMember = issue.space.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      );

      if (issue.space.owner.toString() !== req.user._id.toString() && !isMember) {
        res.status(403).json({ message: 'Not authorized to update this issue' });
        return;
      }

      issue.title = title || issue.title;
      issue.description = description || issue.description;
      issue.status = status || issue.status;
      issue.priority = priority || issue.priority;
      issue.assignee = assignee === '' ? null : assignee || issue.assignee;
      issue.team = team || issue.team; 
      issue.reporter = reporter || issue.reporter; 
      issue.dueDate = dueDate || issue.dueDate;

      const updatedIssue = await issue.save();

      const fullyPopulatedIssue = await Issue.findById(updatedIssue._id)
        .populate('space', 'name owner members spaceKey')
        .populate('project', 'name issueKey')
        .populate('assignee', 'name email profilePicture')
        .populate('createdBy', 'name email')
        .populate('reporter', 'name email')
        .populate({
          path: 'comments',
          populate: { path: 'user', select: 'name email profilePicture' }
        });

      res.json(fullyPopulatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate('space', 'owner members spaceKey')
      .populate('project', 'name issueKey')
      .populate('reporter', 'name email');

    if (issue) {
      
      if (issue.space.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this issue' });
        return;
      }

      await issue.deleteOne();

      res.json({ message: 'Issue removed' });
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllIssues = async (req, res) => {
  try {
    
    const spaces = await Space.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select('_id'); 

    const spaceIds = spaces.map(space => space._id);

    
    const issues = await Issue.find({
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id },
        { space: { $in: spaceIds } }
      ]
    })
      .populate('space', 'name spaceKey') 
      .populate('project', 'name issueKey') 
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email')
      .populate('reporter', 'name email');

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSidebarIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ assignee: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('issueId _id'); 

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const searchIssues = async (req, res) => {
  try {
    const { keyword, status, priority, assignee, project } = req.query;

    
    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (assignee) {
      query.assignee = assignee;
    }

    if (project) {
      query.project = project;
    }

    
    const issues = await Issue.find(query)
      .populate('space', 'name spaceKey')
      .populate('project', 'name issueKey')
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email')
      .populate('reporter', 'name email');

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getIssueSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.json([]);
    }

    const issues = await Issue.find({
      $or: [
        { issueId: { $regex: keyword, $options: 'i' } },
        { title: { $regex: keyword, $options: 'i' } },
      ],
    })
      .limit(10)
      .select('_id issueId title');

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addAttachment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    issue.attachments.push(req.file.path);
    await issue.save();

    res.status(200).json({ message: 'Attachment added successfully', attachmentPath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
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
};