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

const BacklogIssueItem = ({ issue }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assigneeProfilePicture = issue.assignee?.profilePicture || profilePic;
  const assigneeName = issue.assignee?.name || 'Unassigned';

  return (
    <div
      key={issue._id}
      className="border border-gray-200 rounded-md p-4 flex justify-between items-center hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/issue/${issue.issueId}`)}>{issue.issueId}</p>
        <p className="text-base font-medium text-gray-900">{issue.title}</p>
      </div>
      <div className="flex items-center gap-16">
        <select
          value={issue.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            dispatch(updateIssue({ id: issue._id, issueData: { status: e.target.value } }));
          }}
          className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm w-32 ${
            issue.status === 'To Do' ? 'bg-gray-200 text-gray-800' :
            issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            issue.status === 'Done' ? 'bg-green-100 text-green-800' :
            ''
          }`}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium flex items-center gap-1">
            <PriorityIcon priority={issue.priority} size={16} />
          </span>
          {issue.assignee && (
            <img
              src={assigneeProfilePicture}
              alt={assigneeName}
              title={`Assignee: ${assigneeName}`}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BacklogIssueItem;