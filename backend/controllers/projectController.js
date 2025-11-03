const Project = require('../models/Project');
const User = require('../models/User');


const createProject = async (req, res) => {
  let { name, description, issueKey, type, color, spaceId } = req.body;

  try {
    
    if (!issueKey) {
      const namePrefix = name.substring(0, 3).toUpperCase();
      let uniqueKeyFound = false;
      let counter = 0;
      let generatedIssueKey;

      while (!uniqueKeyFound && counter < 100) { 
        const randomNum = Math.floor(1000 + Math.random() * 9000); 
        generatedIssueKey = `${namePrefix}-${randomNum}`;
        const existingProject = await Project.findOne({ issueKey: generatedIssueKey });
        if (!existingProject) {
          uniqueKeyFound = true;
        }
        counter++;
      }

      if (!uniqueKeyFound) {
        
        generatedIssueKey = `${namePrefix}-${Date.now()}`;
      }
      issueKey = generatedIssueKey;
    } else {
      
      issueKey = issueKey.toUpperCase().trim(); 
      const existingProject = await Project.findOne({ issueKey });
      if (existingProject) {
        return res.status(400).json({ message: 'Issue key already exists. Please choose a different one.' });
      }
    }

    const project = await Project.create({
      name,
      description,
      issueKey, 
      type,
      owner: req.user._id,
      members: [req.user._id],
      color,
      space: spaceId,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProjects = async (req, res) => {
  try {
    const { spaceId } = req.query;
    const query = {
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    };

    if (spaceId) {
      query.space = spaceId;
    }

    const projects = await Project.find(query).populate('owner', 'name email profilePicture').populate('members', 'name email profilePicture');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email _id')
      .populate('members', 'name email profilePicture')
      .populate('space', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    
    if (!project.space) {
      return res.status(404).json({ message: 'Associated space not found for this project.' });
    }

    
    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (project.owner.toString() === req.user._id.toString() || isMember) {
      res.json(project);
    } else {
      res.status(403).json({ message: 'Not authorized to access this project' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not retrieve project details.' });
  }
};


const updateProject = async (req, res) => {
  const { name, description, issueKey, type, color, spaceId } = req.body; 

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Not authorized to update this project' });
        return;
      }

      project.name = name || project.name;
      project.description = description || project.description;
      project.type = type || project.type; 
      project.color = color || project.color; 
      project.space = spaceId || project.space; 

      if (issueKey) {
        project.issueKey = issueKey.toUpperCase().trim();
      } else if (!project.issueKey) {
        const namePrefix = project.name.substring(0, 3).toUpperCase();
        let uniqueKeyFound = false;
        let counter = 0;
        let generatedIssueKey;

        while (!uniqueKeyFound && counter < 100) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          generatedIssueKey = `${namePrefix}-${randomNum}`;
          const existingProject = await Project.findOne({ issueKey: generatedIssueKey });
          if (!existingProject) {
            uniqueKeyFound = true;
          }
          counter++;
        }

        if (!uniqueKeyFound) {
          generatedIssueKey = `${namePrefix}-${Date.now()}`;
        }
        project.issueKey = generatedIssueKey;
      }

      const updatedProject = await project.save();
      await updatedProject.populate('owner', 'name email profilePicture');
      await updatedProject.populate('members', 'name email profilePicture');

      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this project' });
        return;
      }

      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addMemberToProject = async (req, res) => {
  const { email } = req.body; 

  try {
    const project = await Project.findById(req.params.id);
    const user = await User.findOne({ email }); 

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    if (!user) {
      res.status(404).json({ message: 'User not found with that email' }); 
      return;
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to add members to this project' });
      return;
    }

    
    if (project.members.some(member => member.toString() === user._id.toString())) {
      res.status(400).json({ message: 'User is already a member of this project' });
      return;
    }

    project.members.push(user._id); 
    await project.save();

    
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email _id')
      .populate('members', 'name email profilePicture _id'); 

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeMemberFromProject = async (req, res) => {
  const { userId } = req.params;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to remove members from this project' });
      return;
    }

    project.members = project.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateKanbanStatuses = async (req, res) => {
  const { statuses } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      
      const isMember = project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      );

      if (project.owner.toString() !== req.user._id.toString() && !isMember) {
        res.status(403).json({ message: 'Not authorized to update this project' });
        return;
      }

      project.kanbanStatuses = statuses || project.kanbanStatuses;

      await project.save();
      const updatedProject = await Project.findById(project._id)
        .populate('owner', 'name email')
        .populate('members', 'name email profilePicture');
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  updateKanbanStatuses,
};