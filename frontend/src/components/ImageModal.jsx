import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-1"
        >
          <X size={24} />
        </button>
        <img src={imageUrl} alt="Enlarged view" className="max-w-full max-h-screen object-contain" />
      </div>
    </div>
  );
};

export default ImageModal;
