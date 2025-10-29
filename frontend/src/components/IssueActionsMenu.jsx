import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IssueActionsMenu = ({ issueId, onEdit, onDelete, isOwner, editMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left font-inter" ref={menuRef}>
      <div>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        >
          <span className="sr-only">Open options</span>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => handleNavigate(`/issue/${issueId}`)}
              className="flex items-center text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              tabIndex="-1"
            >
              <Eye size={16} className="mr-3" />
              View Issue
            </button>
            <button
              onClick={() => { onEdit(); setIsOpen(false); }}
              className="flex items-center text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
              tabIndex="-1"
            >
              <Pencil size={16} className="mr-3" />
              {editMode ? 'Cancel Edit' : 'Edit Issue'}
            </button>
            {isOwner && (
              <button
                onClick={() => { onDelete(); setIsOpen(false); }}
                className="flex items-center text-red-600 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                role="menuitem"
                tabIndex="-1"
              >
                <Trash2 size={16} className="mr-3" />
                Delete Issue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueActionsMenu;
