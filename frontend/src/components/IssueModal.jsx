import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from './QuillEditor';
import 'react-quill/dist/quill.snow.css';
import { createIssue } from '../store/issueSlice';
import { getAllUsers } from '../store/authSlice';
import { getAllSpaces, getSpaceMembers } from '../store/spaceSlice';
import { getProjects } from '../store/projectSlice';
import { X } from 'lucide-react';

const IssueModal = ({ isOpen, onClose, spaceId, projectId }) => {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const { loading: issueLoading, error: issueError } = useSelector((state) => state.issues);
  const { users, userInfo } = useSelector((state) => state.auth);
  const { spaces, spaceMembers } = useSelector((state) => state.spaces);
  const { projects } = useSelector((state) => state.projects);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
    team: '',
    reporter: '',
  });

  const [selectedSpaceId, setSelectedSpaceId] = useState(spaceId);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      dispatch(getAllUsers());
      if (!spaceId) dispatch(getAllSpaces());
      if (userInfo) setForm((f) => ({ ...f, reporter: userInfo._id }));
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch, spaceId, userInfo, spaces, users]);

  useEffect(() => {
    if (spaceId) {
      setSelectedSpaceId(spaceId);
    } else if (!selectedSpaceId && spaces?.length > 0) {
      setSelectedSpaceId(spaces[0]._id);
    }
  }, [spaceId, spaces, selectedSpaceId]);

  useEffect(() => {
    if (selectedSpaceId) {
      dispatch(getSpaceMembers(selectedSpaceId));
      dispatch(getProjects(selectedSpaceId)); 
    }
  }, [selectedSpaceId, dispatch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };


  const handleDescriptionChange = (value) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetSpaceId = spaceId || selectedSpaceId;
    if (!form.title || !targetSpaceId || !selectedProjectId) return;

    try {
      await dispatch(
        createIssue({
          spaceId: targetSpaceId,
          issueData: { ...form, projectId: selectedProjectId },
        })
      ).unwrap();

      setForm({
        title: '',
        description: '',
        priority: 'Medium',
        assignee: '',
        dueDate: '',
        issueTicket: '',
        team: '',
        reporter: userInfo?._id || '',
      });
      onClose();
    } catch (err) {
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Create New Issue</h2>
        {issueError && <p className="text-red-500 mb-4">Error: {issueError}</p>}

        <form id="issue-form" onSubmit={handleSubmit} className="flex space-x-8">
          
          <div className="flex-grow">
            {!spaceId && (
              <div className="mb-4">
                <label
                  htmlFor="selectSpace"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Space
                </label>
                <select
                  id="selectSpace"
                  value={selectedSpaceId}
                  onChange={(e) => setSelectedSpaceId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select a space</option>
                  {spaces?.length > 0 ? (
                    spaces.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No spaces available</option>
                  )}
                </select>
              </div>
            )}

            {selectedSpaceId && (
              <div className="mb-4">
                <label
                  htmlFor="selectProject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Project
                </label>
                <select
                  id="selectProject"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select a project</option>
                  {projects?.length > 0 ? (
                    projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No projects available for this space</option>
                  )}
                </select>
              </div>
            )}



            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <QuillEditor
                ref={quillRef}
                value={form.description}
                onChange={handleDescriptionChange}
                className="mt-1 bg-white h-64 quill-editor"
              />
            </div>
          </div>

          
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-0 space-y-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                  Assignee
                </label>
                <select
                  id="assignee"
                  value={form.assignee}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="">Select Assignee</option> 
                  {users?.length > 0 ? (
                    users.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No users available</option>
                  )}
                </select>
              </div>



              <div>
                <label htmlFor="reporter" className="block text-sm font-medium text-gray-700">
                  Reporter
                </label>
                <select
                  id="reporter"
                  value={form.reporter}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="">Select Reporter</option>
                  {users?.length > 0 ? (
                    users.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No users available</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="issue-form"
                  disabled={issueLoading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {issueLoading ? 'Creating...' : 'Create Issue'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
