import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import profilePic from '../assets/img/profile-pic.jpg';
import { UserCircle, LogOut, ChevronDown } from 'lucide-react';
import ImageModal from './ImageModal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

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

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };

  const profileHandler = () => {
    
    navigate(`/settings`);
    setIsOpen(false);
  };

  const handleImageDoubleClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl('');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <img
          src={userInfo.profilePicture || profilePic}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          onDoubleClick={() => handleImageDoubleClick(userInfo.profilePicture || profilePic)}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 font-inter">
          <Link
            to="/settings" 
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <UserCircle size={16} className="mr-2" />
            Your Profile
          </Link>
          <button
            onClick={logoutHandler}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
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

export default UserMenu;
