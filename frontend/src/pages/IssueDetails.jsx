import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIssueById, updateIssue, deleteIssue, createComment, updateComment, deleteComment } from '../store/issueSlice';
import CommentMenu from '../components/CommentMenu';
import IssueActionsMenu from '../components/IssueActionsMenu';
import { formatDateTime, formatRelativeTime } from '../utils/dateUtils';
import profilePic from '../assets/img/profile-pic.jpg';
import { Bug, BookOpen, CheckSquare, ChevronsUp, Equal, ChevronsDown, MessageSquare } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageModal from '../components/ImageModal';


const IssueTypeIcon = ({ type, ...props }) => {
  switch (type) {
    case 'Bug': return <Bug {...props} />;
    case 'Story': return <BookOpen {...props} />;
    case 'Task': return <CheckSquare {...props} />;
    default: return null;
  }
};


const PriorityIcon = ({ priority, ...props }) => {
  switch (priority) {
            case 'High': return <ChevronsUp className="text-red-500" {...props} />;
            case 'Medium': return <Equal className="text-yellow-500" {...props} />;
            case 'Low': return <ChevronsDown className="text-green-500" {...props} />;    default: return null;
  }
};


const CommentInput = ({ currentUserAvatar, onSave, onImageDoubleClick }) => {
  const [commentText, setCommentText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    if (commentText.trim()) {
      onSave(commentText);
      setCommentText('');
      setIsFocused(false);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setIsFocused(false);
  };

  return (
    <div className="flex items-start gap-3">
      <img
        src={currentUserAvatar}
        alt="Your avatar"
        className="w-7 h-7 rounded-full object-cover cursor-pointer"
        onDoubleClick={() => onImageDoubleClick(currentUserAvatar)}
      />
      <div className="w-full">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          rows={isFocused ? 3 : 1}
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              disabled={!commentText.trim()}
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const IssueDetails = () => {
  const { issueId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentIssue, loading, error } = useSelector((state) => state.issues);
  const { userInfo } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueStatus, setIssueStatus] = useState('');
  const [issuePriority, setIssuePriority] = useState('');
  const [issueAssignee, setIssueAssignee] = useState('');
  const [issueDueDate, setIssueDueDate] = useState('');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ issueId, commentId }));
    }
  };

  const handleUpdateComment = () => {
    if (editingCommentText.trim()) {
      dispatch(updateComment({ issueId: id, commentId: editingCommentId, text: editingCommentText }));
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  useEffect(() => {
    if (issueId) {
      dispatch(getIssueById(issueId));
    }
  }, [dispatch, issueId]);

  useEffect(() => {
    if (currentIssue) {
      setIssueTitle(currentIssue.title);
      setEditedTitle(currentIssue.title);
      setIssueDescription(currentIssue.description);
      setEditedDescription(currentIssue.description);
      setIssueStatus(currentIssue.status);
      setIssuePriority(currentIssue.priority);
      setIssueAssignee(currentIssue.assignee ? currentIssue.assignee._id : '');
      setIssueDueDate(currentIssue.dueDate ? new Date(currentIssue.dueDate).toISOString().split('T')[0] : '');
    }
  }, [currentIssue]);

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== currentIssue.title) {
      dispatch(updateIssue({ id: currentIssue._id, issueData: { title: editedTitle } }));
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    dispatch(updateIssue({ id: currentIssue._id, issueData: { description: editedDescription } }));
    setIsEditingDescription(false);
  };

  const handleSaveComment = (text) => {
    dispatch(createComment({ issueId: id, text }));
  };

  const updateIssueHandler = (e) => {
    e.preventDefault();
    dispatch(updateIssue({
      id: currentIssue._id,
      issueData: {
        title: issueTitle,
        description: issueDescription,
        status: issueStatus,
        priority: issuePriority,
        assignee: issueAssignee || null,
        dueDate: issueDueDate || null,
      },
    }));
    setEditMode(false);
  };

  const deleteIssueHandler = () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      dispatch(deleteIssue(currentIssue._id));
      navigate(`/space/${currentIssue.space._id}`);
    }
  };

  const handleImageDoubleClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl('');
  };

  if (loading && !currentIssue) return <p>Loading issue details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!currentIssue) return <p>Issue not found.</p>;

  const isSpaceOwner = userInfo && currentIssue.space.owner === userInfo._id;

  return (
    <div className="min-h-screen bg-white p-8 font-inter">
      {editMode ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full">
          <h2 className="text-2xl font-semibold mb-4">Edit Issue</h2>
          
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-3/4 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <IssueTypeIcon type={currentIssue.type} size={24} className="text-gray-600" />
              <div className="w-full">
                <p className="text-sm text-gray-500 mb-1">
                  <Link to="/spaces" className="hover:underline">Spaces</Link> / {' '}
                  <Link to={`/space/${currentIssue.space._id}`} className="hover:underline">{currentIssue.space.name}</Link> / {' '}
                  <Link to={`/issue/${currentIssue.issueId}`} className="hover:underline">{currentIssue.issueId}</Link>
                </p>
                {isEditingTitle ? (
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSave();
                      } else if (e.key === 'Escape') {
                        setEditedTitle(currentIssue.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="text-3xl font-extrabold text-gray-900 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <h1 onDoubleClick={() => setIsEditingTitle(true)} className="text-3xl font-extrabold text-gray-900 cursor-pointer p-2 border border-transparent rounded-md hover:bg-gray-100">
                    {currentIssue.title}
                  </h1>
                )}
              </div>
            </div>
            <hr className="border-gray-300" />

            <div className="flex flex-col gap-8">
              <div className="min-h-[15rem] overflow-y-auto pr-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Description</h2>
                {isEditingDescription ? (
                  <div>
                    <ReactQuill
                      theme="snow"
                      value={editedDescription}
                      onChange={setEditedDescription}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ],
                      }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={handleDescriptionSave}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDescription(false)}
                        className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDoubleClick={() => setIsEditingDescription(true)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div
                      className="prose max-w-none text-gray-700 ql-editor"
                      dangerouslySetInnerHTML={{ __html: currentIssue.description || '<p>No description provided.</p>' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col flex-1 min-h-0">
                <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
                  <MessageSquare size={20} className="mr-2" /> Comments
                </h2>
                <CommentInput 
                  currentUserAvatar={userInfo.profilePicture || profilePic} 
                  onSave={handleSaveComment}
                  onImageDoubleClick={handleImageDoubleClick}
                />
                <div className="mt-6 border-t border-gray-200 pt-6 flex-1 overflow-y-auto space-y-6 pr-2">
                  {currentIssue.comments && currentIssue.comments.length > 0 ? (
                    [...currentIssue.comments].reverse().map(comment => (
                      <div key={comment._id} className="flex items-start gap-3">
                          <img
                            src={comment.user.profilePicture || profilePic}
                            alt={`${comment.user.name}'s avatar`}
                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            onDoubleClick={() => handleImageDoubleClick(comment.user.profilePicture || profilePic)}
                          />
                        <div className="w-full">
                          {editingCommentId === comment._id ? (
                            <div>
                              <textarea
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <button onClick={handleUpdateComment} className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">Save</button>
                                <button onClick={() => setEditingCommentId(null)} className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm">{comment.user.name}</p>
                                    <p className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</p>
                                </div>
                                <CommentMenu
                                    comment={comment}
                                    onEdit={(comment) => {
                                        setEditingCommentId(comment._id);
                                        setEditingCommentText(comment.text);
                                    }}
                                    onDelete={handleDeleteComment}
                                    isAuthor={userInfo && userInfo._id === comment.user._id}
                                />
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:w-1/4 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <select
                id="statusSelect"
                value={currentIssue.status}
                onChange={(e) => dispatch(updateIssue({ id: currentIssue._id, issueData: { status: e.target.value } }))}
                className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm w-32 ${
                  currentIssue.status === 'To Do' ? 'bg-gray-200 text-gray-800' :
                  currentIssue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  currentIssue.status === 'Done' ? 'bg-green-100 text-green-800' :
                  ''
                }`}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <IssueActionsMenu
                issueId={currentIssue._id}
                onEdit={() => setEditMode(!editMode)}
                onDelete={deleteIssueHandler}
                isOwner={isSpaceOwner}
                editMode={editMode}
              />
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Details</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <h3 className="w-1/2 text-gray-500 font-medium">Priority</h3>
                  <div className="w-1/2 text-left">
                    <div className="flex items-center gap-2">
                      <PriorityIcon priority={currentIssue.priority} size={16} />
                      <span className="font-medium text-gray-700">{currentIssue.priority}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <h3 className="w-1/2 text-gray-500 font-medium">Assignee</h3>
                  <div className="w-1/2 text-left">
                    {currentIssue.assignee ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={currentIssue.assignee.profilePicture || profilePic}
                          alt={currentIssue.assignee.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-700">{currentIssue.assignee.name}</span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-700 text-left">Unassigned</p>
                    )}
                  </div>
                </div>
                {currentIssue.dueDate && (
                  <div className="flex items-center">
                    <h3 className="w-1/2 text-gray-500 font-medium">Due Date</h3>
                    <div className="w-1/2 text-left">
                      <p className="font-medium text-gray-700 text-left">{new Date(currentIssue.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <h3 className="w-1/2 text-gray-500 font-medium">Created By</h3>
                  <div className="w-1/2 text-left">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentIssue.createdBy && currentIssue.createdBy.profilePicture ? currentIssue.createdBy.profilePicture : profilePic}
                        alt={currentIssue.createdBy.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-700">{currentIssue.createdBy.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Created {formatDateTime(currentIssue.createdAt)}</p>
              <p>Updated {formatRelativeTime(currentIssue.updatedAt)}</p>
            </div>
          </div>
        </div>
      )}

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={modalImageUrl}
      />
    </div>
  );
};

export default IssueDetails;
