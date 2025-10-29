import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronsUp, Equal, ChevronsDown } from 'lucide-react';
import IssueActionsMenu from './IssueActionsMenu'; 
import profilePic from '../assets/img/profile-pic.jpg'; 


const PriorityIcon = ({ priority, ...props }) => {
  switch (priority) {
    case 'High': return <ChevronsUp className="text-red-500" {...props} />;
    case 'Medium': return <Equal className="text-yellow-500" {...props} />;
    case 'Low': return <ChevronsDown className="text-green-500" {...props} />;
    default: return null;
  }
};

const KanbanIssueItem = ({ issue, currentProject, isOwner, handleDeleteIssue, handleDragStart, handleDragEnd }) => {
  const navigate = useNavigate();

  return (
    <div
      key={issue._id}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, issue._id)}
      onDragEnd={handleDragEnd}
      onClick={() => navigate(`/issue/${issue.issueId}`)}
      className="bg-white p-3 rounded-md shadow-sm mb-2 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col justify-between min-h-[100px] relative"
      style={{ borderLeft: `4px solid ${currentProject.color}` }}
    >
      <div className="absolute top-2 right-2 z-10"> 
        <IssueActionsMenu
          issueId={issue.issueId}
          onDelete={() => handleDeleteIssue(issue._id)}
          isOwner={isOwner}
          
        />
      </div>
      <p className="font-semibold text-gray-800 mb-1 text-sm">{issue.title}</p>
      <p className="text-sm text-gray-500 mb-2">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          issue.status === 'To Do' ? 'bg-gray-200 text-gray-800' :
          issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          issue.status === 'Done' ? 'bg-green-100 text-green-800' :
          ''
        }`}>
          {issue.status}
        </span>
      </p>
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600 text-xs">{issue.issueId}</p>
        <div className="flex items-center gap-1">
          <PriorityIcon priority={issue.priority} size={16} />
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
    </div>
  );
};

export default KanbanIssueItem;