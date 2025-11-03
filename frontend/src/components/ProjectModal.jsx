import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject } from '../store/projectSlice'; 
import { getAllUsers } from '../store/authSlice';
import { X } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, projectToEdit, spaceId }) => { 
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.auth);
  const { spaces } = useSelector((state) => state.spaces);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [issueKey, setIssueKey] = useState('');
  const [projectColor, setProjectColor] = useState('#000000'); 
  const [selectedSpace, setSelectedSpace] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      dispatch(getAllUsers());
      if (projectToEdit) { 
        setProjectName(projectToEdit.name);
        setProjectDescription(projectToEdit.description);
        setProjectLead(projectToEdit.owner._id); 
        setIssueKey(projectToEdit.issueKey);
        setProjectColor(projectToEdit.color || '#000000');
        setSelectedSpace(projectToEdit.space);
      } else { 
        setProjectName('');
        setProjectDescription('');
        setProjectLead('');
        setProjectColor('#000000');
        setSelectedSpace(spaceId || '');
      }
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch, projectToEdit, spaceId]); 

  useEffect(() => {
    if (users && users.length > 0 && !projectLead) {
      const currentUser = users.find(user => user._id === localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : null);
      if (currentUser) {
        setProjectLead(currentUser._id);
      }
    }
  }, [users, projectLead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName && projectDescription && projectLead && selectedSpace) {
      let projectData = { name: projectName, description: projectDescription, owner: projectLead, color: projectColor, spaceId: selectedSpace };
      if (issueKey) {
        projectData.issueKey = issueKey;
      }
      if (projectToEdit) {
        dispatch(updateProject({ id: projectToEdit._id, projectData }));
      } else {
        dispatch(createProject(projectData));
      }
      setProjectName('');
      setProjectDescription('');
      setProjectLead('');
      setProjectColor('#000000');
      setSelectedSpace('');
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">{projectToEdit ? 'Edit Project' : 'Create New Project'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              id="projectName"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label htmlFor="space" className="block text-sm font-medium text-gray-700">Space</label>
            <select
              id="space"
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={!!spaceId}
            >
              <option value="">Select a Space</option>
              {spaces && spaces.map((space) => (
                <option key={space._id} value={space._id}>
                  {space.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectColor" className="block text-sm font-medium text-gray-700">Project Color</label>
            <input
              type="color"
              id="projectColor"
              value={projectColor}
              onChange={(e) => setProjectColor(e.target.value)}
              className="mt-1 block w-full h-10 border rounded p-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="projectLead" className="block text-sm font-medium text-gray-700">Project Lead</label>
            <select
              id="projectLead"
              value={projectLead}
              onChange={(e) => setProjectLead(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a Lead</option>
              {users && users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              id="projectDescription"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              rows="3"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (projectToEdit ? 'Updating...' : 'Creating...') : (projectToEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-2 text-sm">Error: {error}</p>}
      </div>
    </div>
  );
};

export default ProjectModal;