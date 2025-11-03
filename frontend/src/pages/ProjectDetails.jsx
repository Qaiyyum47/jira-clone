import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../store/projectSlice';
import { getIssues, updateIssue } from '../store/issueSlice';
import { Bug, CheckSquare, Clock, Search, Globe, Rows3, Columns3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import ProjectActionsMenu from '../components/ProjectActionsMenu';
import CheckboxDropdown from '../components/CheckboxDropdown';
import IssueActionsMenu from '../components/IssueActionsMenu';
import ProjectModal from '../components/ProjectModal';
import ImageModal from '../components/ImageModal';
import BacklogItem from '../components/BacklogItem';
import KanbanIssueItem from '../components/KanbanIssueItem';
import profilePic from '../assets/img/profile-pic.jpg';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProject, loading: projectLoading, error: projectError } = useSelector((state) => state.projects);
  const { issues, loading: issueLoading, error: issueError } = useSelector((state) => state.issues);
  const { userInfo } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showEditProjectModal, setShowEditProjectModal] = useState(false); 
  const [projectToEdit, setProjectToEdit] = useState(null); 
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [statuses, setStatuses] = useState(['To Do', 'In Progress', 'Done']);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleImageDoubleClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl('');
  };

  const handleDeleteIssue = (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      dispatch(deleteIssue(issueId));
    }
  };


  const handleAddSection = () => {
    const newStatus = prompt('Enter new section name:');
    if (newStatus && !statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
    }
  };

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (id) {
        const projectResult = await dispatch(getProjectById(id));
        
        if (projectResult.payload && projectResult.payload.space) {
          await dispatch(getIssues({ spaceId: projectResult.payload.space._id, projectId: projectResult.payload._id }));
        }
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
      setProjectDescription(currentProject.description);
    }
  }, [currentProject]);

  const updateProjectHandler = (e) => {
    e.preventDefault();
    dispatch(updateProject({ id, projectData: { name: projectName, description: projectDescription } }));
    setEditMode(false);
  };

  const deleteProjectHandler = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
      navigate('/');
    }
  };

  
  const handleDragStart = (e, issueId) => {
    e.dataTransfer.setData('issueId', issueId);
    e.dataTransfer.effectAllowed = 'move';
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.currentTarget.classList.add('dragging'); 
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging'); 
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');
    dispatch(updateIssue({ issueId: issueId, issueData: { status: newStatus } }));
  };

  const uniqueIssues = [...new Map(issues.map((issue) => [issue['_id'], issue])).values()];
  const projectIssues = uniqueIssues.filter(issue => issue.project?._id === currentProject?._id);



  const uniqueIssueUsers = useMemo(() => {
    const userMap = new Map();
    projectIssues.forEach(issue => {
      if (issue.assignee) {
        userMap.set(issue.assignee._id, issue.assignee);
      }
      if (issue.reporter) {
        userMap.set(issue.reporter._id, issue.reporter);
      }
    });
    return Array.from(userMap.values());
  }, [projectIssues, statusFilter, priorityFilter, assigneeFilter]);

  if (initialLoading) return null;
  if (projectError) return <p className="text-red-500">Error: {projectError}</p>;
  if (issueError) return <p className="text-red-500">Error: {issueError}</p>;
  if (!currentProject) return <p>Project not found.</p>;

  const totalIssues = projectIssues.length;
  const doneIssues = issues.filter(issue => issue.status === 'Done').length;
  const donePercentage = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  
  const priorityData = [
    { name: 'High', count: issues.filter(issue => issue.priority === 'High').length, fill: '#ef4444' },
    { name: 'Medium', count: issues.filter(issue => issue.priority === 'Medium').length, fill: '#f59e0b' },
    { name: 'Low', count: issues.filter(issue => issue.priority === 'Low').length, fill: '#22c55e' },
  ];

  const isOwner = userInfo && currentProject.owner._id === userInfo._id;

  return (
    <div className="p-6">
      
      <p className="text-sm text-gray-500 mb-1">
        <Link to="/spaces" className="hover:underline">Spaces</Link> / {' '}
        {currentProject.space && (
          <button onClick={() => window.location.reload()} className="hover:underline">{currentProject.space.name}</button>
        )}
      </p>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-jiraBlue-DEFAULT">{currentProject.name}</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            {isOwner && (
              <ProjectActionsMenu
                onEdit={() => {
                  setShowEditProjectModal(true);
                  setProjectToEdit(currentProject);
                }}
                onDelete={deleteProjectHandler}
                editMode={editMode}
              />
            )}
          </div>
        </div>
      </div>

      
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium flex items-center space-x-2 ${activeTab === 'summary' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('summary')}
        >
          <Globe size={16} />
          <span>Summary</span>
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium flex items-center space-x-2 ${activeTab === 'backlog' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('backlog')}
        >
          <Rows3 size={16} />
          <span>Backlog</span>
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium flex items-center space-x-2 ${activeTab === 'kanban' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('kanban')}
        >
          <Columns3 size={16} />
          <span>Active Sprint</span>
        </button>
      </div>

      {activeTab === 'kanban' && (
        <div className="flex items-center mb-6 space-x-4">
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search board"
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {uniqueIssueUsers && uniqueIssueUsers.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden">
              {uniqueIssueUsers.map((user, index) => (
                <img
                  key={user._id}
                  src={user.profilePicture || profilePic}
                  alt={user.name}
                  title={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  style={{ zIndex: uniqueIssueUsers.length - index }} 
                />
              ))}
            </div>
          )}

          
          <CheckboxDropdown
            label="Status"
            options={statuses.map(s => ({ label: s, value: s }))}
            selectedValues={statusFilter}
            onChange={setStatusFilter}
          />

          
          <CheckboxDropdown
            label="Priority"
            options={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ]}
            selectedValues={priorityFilter}
            onChange={setPriorityFilter}
          />
        </div>
      )}



      
                        {activeTab === 'summary' && (
                          <div className="w-1/2 mx-auto space-y-6"> 
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> 
                              
                              <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
                                <Bug size={24} className="text-blue-500" />
                                <div>
                                  <p className="text-2xl font-bold text-gray-800">{totalIssues}</p>
                                  <p className="text-sm text-gray-600">Total Issues</p>
                                </div>
                              </div>
                
                              
                              <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-3 mb-2">
                                  <CheckSquare size={24} className="text-green-500" />
                                  <div>
                                    <p className="text-2xl font-bold text-gray-800">{doneIssues}</p>
                                    <p className="text-sm text-gray-600">Issues Done</p>
                                  </div>
                                </div>
                                {totalIssues > 0 && (
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-green-500 h-2.5 rounded-full"
                                      style={{ width: `${donePercentage}%` }}
                                    ></div>
                                  </div>
                                )}
                                {totalIssues > 0 && (
                                  <p className="text-xs text-gray-500 mt-1 text-right">{donePercentage}% Done</p>
                                )}
                              </div>
                
                              
                              <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
                                <Clock size={24} className="text-yellow-500" />
                                <div>
                                  <p className="text-2xl font-bold text-gray-800">{totalIssues - doneIssues}</p>
                                  <p className="text-sm text-gray-600">Issues Pending</p>
                                </div>
                              </div>
                            </div>
            
                
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full space-y-4"> 
                    
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Issues by Priority</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={priorityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" /> 
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                          </div>
                        )}
      {activeTab === 'kanban' && (
        <>


          
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {statuses.map((status) => (
                <div
                  key={status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                  className="p-3 rounded-lg min-h-[400px] w-90 flex-shrink-0"
                  style={{ backgroundColor: '#f8f8f8' }}
                >
                  <div className="text-sm font-medium text-gray-500 pb-2 mb-4 border-b border-gray-200 flex items-center space-x-2">
                    <span>{status}</span>
                    <span className="px-3 py-0 text-xs rounded-md bg-gray-200 text-gray-800">
                      {projectIssues.filter((issue) => issue.status === status).length}
                    </span>
                  </div>
                  {projectIssues
                    .filter((issue) => issue.status === status)
                    .map((issue) => (
                      <KanbanIssueItem
                        key={issue._id}
                        issue={issue}
                        currentProject={currentProject}
                        isOwner={isOwner}
                        handleDeleteIssue={handleDeleteIssue}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                      />
                    ))}
                </div>
              ))}
              <div 
                className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-gray-200 w-48 flex-shrink-0"
                onClick={handleAddSection}
              >
                <div className="text-center">
                  <i className="fa-solid fa-plus text-2xl text-gray-400"></i>
                  <p className="text-gray-500 mt-2">New Section</p>
                </div>
              </div>
            </div>
        </>
      )}

      {activeTab === 'backlog' && (
        <div className="p-4">
          {issueLoading ? (
            <p className="text-center py-8">Loading issues...</p>
          ) : (
            <>
              {projectIssues.length > 0 ? (
                <div className="">
                  {projectIssues.map((issue) => (
                    <BacklogItem key={issue._id} issue={issue} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No issues found for this project.</p>
              )}
            </>
          )}
        </div>
      )}

      
      {currentProject && ( 
        <ProjectModal
          isOpen={showEditProjectModal}
          onClose={() => {
            setShowEditProjectModal(false);
            dispatch(getProjectById(id)); 
          }}
          projectToEdit={projectToEdit}
        />
      )}

      
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={modalImageUrl}
      />
    </div>
  );
};

export default ProjectDetails;