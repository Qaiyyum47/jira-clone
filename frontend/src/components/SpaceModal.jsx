import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSpace } from '../store/spaceSlice';
import { X } from 'lucide-react';

const SpaceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.spaces);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setName('');
      setDescription('');
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      dispatch(createSpace({ name, description }));
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Create New Space</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="spaceName" className="block text-sm font-medium text-gray-700">Space Name</label>
            <input
              type="text"
              id="spaceName"
              placeholder="Space Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label htmlFor="spaceDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="spaceDescription"
              placeholder="Space Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Space'}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-2 text-sm">Error: {error.message || 'Failed to create space'}</p>}
      </div>
    </div>
  );
};

export default SpaceModal;