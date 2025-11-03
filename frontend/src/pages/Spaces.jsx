import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects } from '../store/projectSlice';
import { getAllSpaces } from '../store/spaceSlice';
import SpaceModal from '../components/SpaceModal';
import { PlusCircle, Star } from 'lucide-react';
import profilePic from '../assets/img/profile-pic.jpg';
import { formatRelativeTime } from '../utils/dateUtils';

const Spaces = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spaces, loading: spacesLoading, error: spacesError } = useSelector((state) => state.spaces);

  const [showSpaceModal, setShowSpaceModal] = useState(false);

  const handleSpaceClick = async (spaceId) => {
    const result = await dispatch(getProjects({ spaceId }));
    if (result.payload && result.payload.length > 0) {
      navigate(`/project/${result.payload[0]._id}`);
    } else {
      navigate(`/space/${spaceId}`);
    }
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Spaces</h1>
        <button
          onClick={() => setShowSpaceModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle size={20} className="mr-2" />
          Create New Space
        </button>
      </div>
      <hr className="border-gray-300 my-4" />

      {spacesError && <p className="text-red-500">Error: {spacesError}</p>}

      <div className="mt-8">
        {spacesLoading ? (
          <p className="text-center py-8">Loading...</p>
        ) : spaces.length > 0 ? (
          <div className="overflow-x-auto relative border border-gray-200 shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th scope="col" className="py-2 px-2"><Star size={18} /></th>
                  <th scope="col" className="py-2 px-4">Name</th>
                  <th scope="col" className="py-2 px-6">Key</th>
                  <th scope="col" className="py-2 px-6">Type</th>
                  <th scope="col" className="py-2 px-6">Lead</th>
                  <th scope="col" className="py-2 px-6">Last Work Update</th>
                  <th scope="col" className="py-2 px-6">Space URL</th>
                </tr>
              </thead>
              <tbody>
                {spaces.map((space) => (
                  <tr
                    key={space._id}
                    className="bg-white border-b border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSpaceClick(space._id)}
                  >
                    <td className="py-2 px-2 text-center">
                      <Star size={18} className="text-gray-400 hover:text-yellow-500 cursor-pointer" />
                    </td>
                    <td className="py-2 px-4 font-medium text-gray-900 whitespace-nowrap text-left">
                      {space.name}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {space.spaceKey}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {space.type || 'N/A'}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {space.owner ? space.owner.name : 'N/A'}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {space.updatedAt ? formatRelativeTime(space.updatedAt) : 'N/A'}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {space.spaceUrl || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No spaces found. Create a space to get started.</p>
        )}
      </div>

      <SpaceModal isOpen={showSpaceModal} onClose={() => setShowSpaceModal(false)} />
    </div>
  );
};

export default Spaces;
