import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects } from '../store/projectSlice';
import { getAllSpaces } from '../store/spaceSlice';
import ProjectModal from '../components/ProjectModal';
import SpaceModal from '../components/SpaceModal';
import { PlusCircle } from 'lucide-react';
import profilePic from '../assets/img/profile-pic.jpg';

const Spaces = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);
  const { spaces, loading: spacesLoading, error: spacesError } = useSelector((state) => state.spaces);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  useEffect(() => {
    dispatch(getAllSpaces());
    dispatch(getProjects());
  }, [dispatch]);

  const projectsBySpace = useMemo(() => {
    if (!spaces.length || !projects.length) return {};
    return spaces.reduce((acc, space) => {
      acc[space._id] = projects.filter(p => p.space === space._id);
      return acc;
    }, {});
  }, [spaces, projects]);

  return (
    <div className="p-8">
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

      {projectsError && <p className="text-red-500">Error: {projectsError}</p>}
      {spacesError && <p className="text-red-500">Error: {spacesError}</p>}

      <div className="space-y-8">
        {(spacesLoading || projectsLoading) ? (
          <p className="text-center py-8">Loading...</p>
        ) : spaces.length > 0 ? (
          spaces.map((space) => (
            <div key={space._id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">{space.name}</h2>
                <button
                  onClick={() => {
                    setSelectedSpaceId(space._id);
                    setShowProjectModal(true);
                  }}
                  className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Create Project
                </button>
              </div>
              <div className="space-y-4">
                {projectsBySpace[space._id] && projectsBySpace[space._id].length > 0 ? (
                  projectsBySpace[space._id].map((project) => (
                    <div
                      key={project._id}
                      className="border border-gray-200 border-l-4 rounded-md p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      style={{ borderLeftColor: project.color || '#ccc' }}
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <p className="text-base font-medium text-gray-900">{project.name}</p>

                      </div>
                      <div className="flex items-center gap-4">

                        {project.owner && (
                          <div className="flex items-center gap-2">
                            <img
                              src={project.owner.profilePicture || profilePic}
                              alt={project.owner.name}
                              title={`Lead: ${project.owner.name}`}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-700">{project.owner.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No projects found in this space.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No spaces found. Create a space to get started.</p>
        )}
      </div>

      <ProjectModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} spaceId={selectedSpaceId} />
      <SpaceModal isOpen={showSpaceModal} onClose={() => setShowSpaceModal(false)} />
    </div>
  );
};

export default Spaces;
