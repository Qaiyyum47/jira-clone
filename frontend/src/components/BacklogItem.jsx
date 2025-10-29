import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../store/issueSlice';
import { ChevronsUp, Equal, ChevronsDown } from 'lucide-react';
import profilePic from '../assets/img/profile-pic.jpg'; 


const PriorityIcon = ({ priority, ...props }) => {
  switch (priority) {
    case 'High': return <ChevronsUp className="text-red-500" {...props} />;
    case 'Medium': return <Equal className="text-yellow-500" {...props} />;
    case 'Low': return <ChevronsDown className="text-green-500" {...props} />;
    default: return null;
  }
};

const BacklogItem = ({ issue }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assigneeProfilePicture = issue.assignee?.profilePicture || profilePic;
  const assigneeName = issue.assignee?.name || 'Unassigned';

  return (
    <div
      key={issue._id}
      className="border border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/issue/${issue.issueId}`)}
      style={{ borderLeft: `4px solid ${issue.project?.color || '#ccc'}` }}
    >
      <div className="flex items-center gap-2">
        <p className="text-blue-600">{issue.issueId}</p>
        <p className="text-base font-medium text-gray-900">{issue.title}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40">
            <span className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-0.5 max-w-[150px] truncate">
              {issue.project?.space?.name || 'N/A Space'}
            </span>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          issue.status === 'To Do' ? 'bg-gray-200 text-gray-800' :
          issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          issue.status === 'Done' ? 'bg-green-100 text-green-800' :
          ''
        }`}>
          {issue.status}
        </span>
        <span className="text-sm font-medium flex items-center gap-1">
          <PriorityIcon priority={issue.priority} size={16} />
        </span>
        {issue.assignee ? (
          <img
            src={assigneeProfilePicture}
            alt={assigneeName}
            title={`Assignee: ${assigneeName}`}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-500">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export default BacklogItem;