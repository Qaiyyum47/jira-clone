import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../store/projectSlice';
import { getAllSpaces } from '../store/spaceSlice';
import { getSidebarIssues } from '../store/issueSlice';
import { Home, FolderKanban, Bug, BarChart3, Settings, ChevronsLeft, UserCircle, LayoutGrid, Columns3, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { projects } = useSelector((state) => state.projects);
  const { spaces } = useSelector((state) => state.spaces);
  const { userInfo } = useSelector((state) => state.auth);
  const { sidebarIssues } = useSelector((state) => state.issues);

  const [expandedSpaces, setExpandedSpaces] = useState(() => {
    try {
      const storedState = localStorage.getItem('expandedSpaces');
      return storedState ? JSON.parse(storedState) : {};
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('expandedSpaces', JSON.stringify(expandedSpaces));
    } catch (error) {
    }
  }, [expandedSpaces]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getAllSpaces());
      dispatch(getProjects());
      
      
    }
  }, [dispatch, userInfo]);

  const projectsBySpace = useMemo(() => {
    if (!spaces || !projects) return {};
    return spaces.reduce((acc, space) => {
      acc[space._id] = projects.filter(p => p.space === space._id);
      return acc;
    }, {});
  }, [spaces, projects]);

  const mainNavItems = [
    { to: "/for-you", Icon: UserCircle, label: "For you" },
    { to: "/spaces", Icon: LayoutGrid, label: "Spaces" },
  ];

  const bottomNavItems = [
  ];

  return (
    <div className={`bg-white text-gray-800 flex flex-col shadow-lg font-inter border-r border-gray-200 fixed top-12 left-0 h-[calc(100vh-3rem)] transition-all duration-300 ${isSidebarOpen ? 'w-48' : 'w-16'}`}>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3">
          <ul>
            {mainNavItems.map(({ to, Icon, label }) => {
              const isSpacesLink = label === 'Spaces';

              return (
                <React.Fragment key={to}>
                  <li className="mb-2">
                    <NavLink
                      to={to}
                      end={!isSpacesLink}
                      className={({ isActive }) =>
                        `flex items-center p-1.5 transition-colors duration-200 ${
                          isActive
                            ? 'border-l-4 border-[#0052CC] text-[#0052CC] font-medium'
                            : 'border-l-4 border-transparent hover:bg-gray-100 text-gray-700'
                        }`
                      }
                    >
                      <Icon className="mr-2" size={18} />
                      {isSidebarOpen && label}
                    </NavLink>
                  </li>
                  {isSidebarOpen && isSpacesLink && (
                    <ul className="pl-2 mb-3">
                      {spaces && spaces.length > 0 ? (
                        spaces.map((space) => (
                          <li key={space._id} className="mb-2">
                            <div
                              className="flex items-center cursor-pointer hover:bg-gray-100 rounded-md p-1 group"
                              onClick={() =>
                                setExpandedSpaces((prev) => ({
                                  ...prev,
                                  [space._id]: !prev[space._id],
                                }))
                              }
                              title={space.name}
                            >
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1">
                                {expandedSpaces[space._id] ? (
                                  <ChevronDown size={16} className="text-gray-500" />
                                ) : (
                                  <ChevronRight size={16} className="text-gray-500" />
                                )}
                              </span>
                              <span className="px-1 text-sm font-semibold text-gray-800 truncate">{space.name}</span>
                            </div>
                            {expandedSpaces[space._id] && (
                              <ul className="pl-4 mt-1">
                                {projectsBySpace[space._id] && projectsBySpace[space._id].map((project) => {
                                  return (
                                    <li key={project._id} className="mb-1">
                                      <NavLink
                                        to={`/project/${project._id}`}
                                        title={project.name}
                                        className={({ isActive }) =>
                                          `flex items-center p-1.5 text-xs transition-colors duration-200 ${
                                            isActive
                                              ? 'border-l-4 border-[#0052CC] text-[#0052CC] font-medium'
                                              : 'border-l-4 border-transparent hover:bg-gray-100 text-gray-600'
                                          }`
                                        }
                                      >
                                        {isSidebarOpen && project.name}
                                      </NavLink>
                                    </li>
                                  );
                                })}                              </ul>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="p-1.5 text-xs text-gray-500">Create a space to see projects</li>
                      )}
                    </ul>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
      </div>

      <nav className="p-3 border-t border-gray-200">
        <ul>
          {bottomNavItems.map(({ to, Icon, label }) => (
            <li key={to} className="mb-2">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center p-1.5 transition-colors duration-200 ${
                    isActive
                      ? 'border-l-4 border-[#0052CC] text-[#0052CC] font-medium'
                      : 'border-l-4 border-transparent hover:bg-gray-100 text-gray-700'
                  }`
                }
              >
                <Icon className="mr-2" size={18} />
                {isSidebarOpen && label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>


    </div>
  );
};

export default Sidebar;