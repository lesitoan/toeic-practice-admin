'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  ArrowUturnLeftIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const UserActions = ({ user, onViewDetail, onRestore, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleViewDetail = () => {
    setIsOpen(false);
    if (onViewDetail) {
      onViewDetail(user);
    }
  };

  const handleRestore = () => {
    setIsOpen(false);
    if (onRestore) {
      onRestore(user);
    }
  };

  const handleEdit = () => {
    setIsOpen(false);
    if (onEdit) {
      onEdit(user);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
      >
        <PencilIcon className="h-4 w-4 mr-1" />
        Edit
        <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <button
              onClick={handleViewDetail}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <EyeIcon className="h-4 w-4 mr-2 text-gray-500" />
              View User Detail
            </button>
            
            {onEdit && (
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2 text-blue-500" />
                Edit User Details
              </button>
            )}
            
            {(user.status === 'Inactive' || user.deleted_at) && onRestore && (
              <button
                onClick={handleRestore}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <ArrowUturnLeftIcon className="h-4 w-4 mr-2 text-green-500" />
                Cancel Delete User
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserActions;

