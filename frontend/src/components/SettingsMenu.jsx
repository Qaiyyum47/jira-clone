import React, { useState, useRef, useEffect } from 'react';
import { Settings, Bell, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsMenu = () => {
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

  const handleGeneralSettingsClick = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const handleNotiSettingsClick = () => {
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 flex items-center"
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 font-inter">
          <button
            onClick={handleGeneralSettingsClick}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <UserCircle size={16} className="mr-2" />
            General Settings
          </button>
          <button
            onClick={handleNotiSettingsClick}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Bell size={16} className="mr-2" />
            Notification Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
