import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPassword, uploadProfilePicture, updateUserProfile } from '../store/authSlice'; // Will create this thunk
import ImageModal from '../components/ImageModal';
import { MoreVertical } from 'lucide-react';

const Settings = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [editableName, setEditableName] = useState(userInfo?.name || '');
  const [editableEmail, setEditableEmail] = useState(userInfo?.email || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Renamed for clarity
  const [profileMessage, setProfileMessage] = useState(null); // Renamed for clarity
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleProfileUpdate = async () => {
    setProfileMessage(null);
    try {
      await dispatch(updateUserProfile({ name: editableName, email: editableEmail })).unwrap();
      setProfileMessage('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      setProfileMessage(error.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match');
      return;
    }

    dispatch(updateUserPassword({ currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch((error) => {
        setMessage(error.message || 'Failed to update password');
      });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setProfileImage(null);
      setProfileImagePreview(null);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setUploadMessage(null);

    if (!profileImage) {
      setUploadMessage('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profileImage);

    try {
      await dispatch(uploadProfilePicture(formData)).unwrap();
      setUploadMessage('Profile picture updated successfully!');
      setProfileImage(null);
      setProfileImagePreview(null);
    } catch (error) {
      setUploadMessage(error.message || 'Failed to upload profile picture.');
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>


      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <div className="relative">
            <MoreVertical
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              size={20}
              onClick={() => setIsEditingProfile(!isEditingProfile)} // Toggle edit mode
            />
          </div>
        </div>
        {profileMessage && (
          <div className={`mb-4 p-3 rounded-md ${profileMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {profileMessage}
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <strong className="text-gray-700">Name:</strong>
            {isEditingProfile ? (
              <input
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700">{userInfo?.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <strong className="text-gray-700">Email:</strong>
            {isEditingProfile ? (
              <input
                type="email"
                value={editableEmail}
                onChange={(e) => setEditableEmail(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700">{userInfo?.email}</p>
            )}
          </div>
        </div>
        {isEditingProfile && (
          <div className="flex gap-2 mt-4 justify-end">
            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditingProfile(false);
                setEditableName(userInfo?.name || ''); // Revert changes
                setEditableEmail(userInfo?.email || ''); // Revert changes
                setProfileMessage(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>




      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
        {uploadMessage && (
          <div className={`mb-4 p-3 rounded-md ${typeof uploadMessage === 'string' && uploadMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {uploadMessage}
          </div>
        )}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={profileImagePreview || userInfo?.profilePicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onDoubleClick={() => handleImageDoubleClick(profileImagePreview || userInfo?.profilePicture || 'https://via.placeholder.com/100')}
          />
          <div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {profileImage && (
              <button
                onClick={handleImageUpload}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Upload Photo
              </button>
            )}
          </div>
        </div>
      </div>


      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Update Password
          </button>
        </form>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        imageUrl={modalImageUrl}
      />
    </div>
  );
};

export default Settings;