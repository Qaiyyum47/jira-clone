import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Search, PlusCircle, Bell, PanelRightOpen, PanelLeftOpen, LayoutGrid } from 'lucide-react';
import UserMenu from './UserMenu';
import { fetchSuggestions, clearSuggestions } from '../store/issueSlice';
import logoJira from '../assets/img/logo-jira.webp';
import SettingsMenu from './SettingsMenu';
import IssueModal from './IssueModal';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions } = useSelector((state) => state.issues);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        dispatch(fetchSuggestions(searchTerm));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        dispatch(clearSuggestions());
      }
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (issueId) => {
    setSearchTerm('');
    setShowSuggestions(false);
    dispatch(clearSuggestions());
    navigate(`/issue/${issueId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white font-inter pt-12">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200 w-full h-12">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100">
            {isSidebarOpen ? <PanelRightOpen size={20} /> : <PanelLeftOpen size={20} />}
          </button>
                    <NavLink to="/spaces">
            <LayoutGrid size={20} />
          </NavLink>
          <img src={logoJira} alt="Jira Clone Logo" className="h-8" />
        </div>
        <div className="flex-1 flex justify-center items-center px-8">
          <div className="relative w-full max-w-md" ref={searchRef}>
            <input
              type="text"
              placeholder="Search"
              className="block w-full bg-gray-50 border border-gray-200 rounded-md py-1 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
                {suggestions.map((issue) => (
                  <li
                    key={issue._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(issue._id)}
                  >
                    <span className="font-bold">{issue.issueId}</span> - {issue.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setShowCreateIssueModal(true)}
            className="flex items-center px-3 py-0.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4"
          >
            <PlusCircle size={16} className="mr-1" />
            Create
          </button>
        </div>
        <div className="flex items-center gap-4"> 
          <button
            
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <SettingsMenu />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 pt-4 relative">
        <div className="group">
          <Sidebar isSidebarOpen={isSidebarOpen} />

        </div>
        <main className={`flex-1 overflow-x-hidden overflow-y-auto px-6 pt-0 pb-2 text-sm transition-all duration-300 ${isSidebarOpen ? 'ml-48' : 'ml-16'}`}>
          <Outlet />
        </main>
      </div>
      <IssueModal
        isOpen={showCreateIssueModal}
        onClose={() => setShowCreateIssueModal(false)}
      />
    </div>
  );
};

export default Layout;
