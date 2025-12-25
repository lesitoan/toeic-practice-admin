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
        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.2)';
        }}
      >
        <PencilIcon className="h-4 w-4 mr-1.5" />
        Actions
        <ChevronDownIcon className={`h-4 w-4 ml-1.5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-20 overflow-hidden"
            style={{ 
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
          >
            <button
              onClick={handleViewDetail}
              className="w-full text-left px-4 py-3 text-sm font-medium flex items-center transition-all duration-150"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.08)';
                e.currentTarget.style.paddingLeft = '1.25rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.paddingLeft = '1rem';
              }}
            >
              <EyeIcon className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary)' }} />
              View User Detail
            </button>
            
            {onEdit && (
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-3 text-sm font-medium flex items-center transition-all duration-150"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.08)';
                  e.currentTarget.style.paddingLeft = '1.25rem';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.paddingLeft = '1rem';
                }}
              >
                <PencilIcon className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary)' }} />
                Edit User Details
              </button>
            )}
            
            {(user.status === 'Inactive' || user.deleted_at) && onRestore && (
              <button
                onClick={handleRestore}
                className="w-full text-left px-4 py-3 text-sm font-medium flex items-center transition-all duration-150"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
                  e.currentTarget.style.paddingLeft = '1.25rem';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.paddingLeft = '1rem';
                }}
              >
                <ArrowUturnLeftIcon className="h-4 w-4 mr-3" style={{ color: 'var(--color-success)' }} />
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

