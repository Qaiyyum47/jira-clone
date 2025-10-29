import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllIssues } from '../store/issueSlice';
import { getProjects } from '../store/projectSlice';
import { Bug, FolderKanban, ChevronsUp, Equal, ChevronsDown } from 'lucide-react'; 

import profilePic from '../assets/img/profile-pic.jpg'; 
import ImageModal from '../components/ImageModal'; 


const PriorityIcon = ({ priority, ...props }) => {
  switch (priority) {
    case 'High': return <ChevronsUp className="text-red-500" {...props} />;
    case 'Medium': return <Equal className="text-yellow-500" {...props} />;
    case 'Low': return <ChevronsDown className="text-green-500" {...props} />;
    default: return null;
  }
};

const ForYou = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { issues, loading: issuesLoading, error: issuesError } = useSelector((state) => state.issues);
  const { projects, loading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (userInfo) {
      dispatch(getAllIssues()); 
      dispatch(getProjects()); 
    }
  }, [dispatch, userInfo]);

  const myAssignedIssues = issues.filter(
    (issue) => issue.assignee?._id === userInfo?._id && issue.status !== 'Done'
  );

  const myProjectsWithOpenIssues = projects.map(project => {
    const openIssuesCount = issues.filter(
      issue => issue.project?._id === project._id && issue.status !== 'Done'
    ).length;
    return { ...project, openIssuesCount };
  }).filter(project => project.openIssuesCount > 0);


  if (issuesLoading || projectsLoading) return <p className="p-8">Loading dashboard...</p>;
  if (issuesError) return <p className="p-8 text-red-500">Error loading issues: {issuesError}</p>;
  if (projectsError) return <p className="p-8 text-red-500">Error loading projects: {projectsError}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">For you</h1>
      <hr className="border-gray-300 my-4" />

      
      <div className="mb-8"> 
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FolderKanban className="mr-2" size={20} /> My Projects ({myProjectsWithOpenIssues.length})
        </h2>
        {myProjectsWithOpenIssues.length > 0 ? (
          <div className="flex flex-wrap gap-4"> 
            {myProjectsWithOpenIssues.map((project) => (
              <div
                key={project._id}
                className="w-56 h-56 border border-gray-200 border-l-4 rounded-lg shadow-md p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                style={{ borderLeftColor: project.color || '#ccc' }}
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2"> 
                    {project.description || 'No description'}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {project.openIssuesCount} Open
                  </span>
                  {project.owner && (
                    <img
                      src={project.owner.profilePicture || profilePic}
                      alt={project.owner.name}
                      title={`Lead: ${project.owner.name}`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No projects with open issues found.</p> 
        )}
      </div> 

      
      <div> 
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Bug className="mr-2" size={20} /> My Assigned Issues ({myAssignedIssues.length})
        </h2>
        {myAssignedIssues.length > 0 ? (
          <div className="space-y-4">
            {myAssignedIssues.map((issue) => (
              <div
                key={issue._id}
                className="border border-gray-200 rounded-md p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/issue/${issue.issueId}`)}
              >
                <div className="flex items-center gap-2">
                  <p className="text-blue-600 hover:underline">{issue.issueId}</p>
                  <p className="text-base font-medium text-gray-900">{issue.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <PriorityIcon priority={issue.priority} size={16} />
                  </span>
                  {issue.assignee && (
                    <img
                      src={issue.assignee.profilePicture || profilePic}
                      alt={issue.assignee.name}
                      title={`Assignee: ${issue.assignee.name}`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No issues assigned to you.</p>
        )}
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={modalImageUrl}
      />
    </div>
  );
};

export default ForYou;