const Space = require('../models/Space');
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');


const createSpace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a space name');
  }

  const generateSpaceKey = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  const spaceKey = generateSpaceKey(name);

  const space = new Space({
    name,
    spaceKey,
    description,
    owner: req.user._id,
    members: [req.user._id],
  });

  const createdSpace = await space.save();
  res.status(201).json(createdSpace);
});


const getSpaces = asyncHandler(async (req, res) => {
  const spaces = await Space.find({ members: req.user._id }).populate('owner', 'name email');
  res.json(spaces);
});


const getSpaceById = asyncHandler(async (req, res) => {
  const space = await Space.findById(req.params.id).populate('owner', 'name email').populate('members', 'name email');

  if (space && space.members.some(member => member._id.equals(req.user._id))) {
    res.json(space);
  } else {
    res.status(404);
    throw new Error('Space not found or you are not a member');
  }
});


const updateSpace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const space = await Space.findById(req.params.id);

  if (space && space.owner.equals(req.user._id)) {
    space.name = name || space.name;
    space.description = description || space.description;
    const updatedSpace = await space.save();
    res.json(updatedSpace);
  } else {
    res.status(404);
    throw new Error('Space not found or you are not the owner');
  }
});


const deleteSpace = asyncHandler(async (req, res) => {
  const space = await Space.findById(req.params.id);

  if (space && space.owner.equals(req.user._id)) {
    
    const projects = await Project.find({ space: space._id });
    for (const project of projects) {
      
      await Issue.deleteMany({ project: project._id });
    }
    
    await Project.deleteMany({ space: space._id });
    
    await space.remove();
    res.json({ message: 'Space and all its projects and issues removed' });
  } else {
    res.status(404);
    throw new Error('Space not found or you are not the owner');
  }
});


const addMemberToSpace = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const space = await Space.findById(req.params.id);
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (space && space.owner.equals(req.user._id)) {
        if (space.members.includes(user._id)) {
            res.status(400);
            throw new Error('User is already a member of this space');
        }
        space.members.push(user._id);
        await space.save();
        res.json(space.members);
    } else {
        res.status(404);
        throw new Error('Space not found or you are not the owner');
    }
});


const removeMemberFromSpace = asyncHandler(async (req, res) => {
    const space = await Space.findById(req.params.id);
    const { memberId } = req.params;

    if (space && space.owner.equals(req.user._id)) {
        if (space.owner.equals(memberId)) {
            res.status(400);
            throw new Error('Cannot remove the owner from the space');
        }
        space.members = space.members.filter(member => !member.equals(memberId));
        await space.save();
        res.json(space.members);
    } else {
        res.status(404);
            throw new Error('Space not found or you are not the owner');
          }
        });
        
        
        const getIssuesBySpace = asyncHandler(async (req, res) => {
          const spaceId = req.params.id;
        
          
          const space = await Space.findById(spaceId);
        
          if (!space) {
            res.status(404);
            throw new Error('Space not found');
          }
        
          
          if (!space.members.some(member => member.equals(req.user._id))) {
            res.status(403);
            throw new Error('Not authorized to access issues in this space');
          }
        
          const issues = await Issue.find({ space: spaceId })
            .populate('project', 'name issueKey')
            .populate('assignee', 'name profilePicture')
            .populate('reporter', 'name profilePicture');
        
          res.json(issues);
        });
        

const getSpaceMembers = asyncHandler(async (req, res) => {
  const space = await Space.findById(req.params.id).populate('members', 'name email profilePicture');

  if (space && space.members.some(member => member._id.equals(req.user._id))) {
    res.json(space.members);
  } else {
    res.status(404);
    throw new Error('Space not found or you are not a member');
  }
});
        
        module.exports = {
          createSpace,
          getSpaces,
          getSpaceById,
          updateSpace,
          deleteSpace,
          addMemberToSpace,
          removeMemberFromSpace,
          getIssuesBySpace,
          getSpaceMembers,
        };