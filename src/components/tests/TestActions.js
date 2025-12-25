import React from 'react';
import { EyeIcon, PencilIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';

const TestActions = ({ test, onView, onEdit, onDelete, onRun }) => {
  const buttonBaseStyle = "inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm";
  
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={() => onView(test)}
          className={buttonBaseStyle}
          title="View test"
          style={{ 
            backgroundColor: 'rgba(91, 86, 227, 0.1)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(91, 86, 227, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.1)';
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.1)';
          }}
        >
          <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
          View
        </button>
      )}
  
      {onEdit && (
        <button
          onClick={() => onEdit(test)}
          className={buttonBaseStyle}
          title="Edit test"
          style={{ 
            backgroundColor: 'rgba(91, 86, 227, 0.1)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(91, 86, 227, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 86, 227, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(91, 86, 227, 0.1)';
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(91, 86, 227, 0.1)';
          }}
        >
          <PencilIcon className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </button>
      )}
      
      {onRun && (
        <button
          onClick={() => onRun(test)}
          className={buttonBaseStyle}
          title="Run test"
          style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-success)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            e.currentTarget.style.color = 'var(--color-success)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(16, 185, 129, 0.1)';
          }}
        >
          <PlayIcon className="h-3.5 w-3.5 mr-1.5" />
          Run
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={() => onDelete(test)}
          className={buttonBaseStyle}
          title="Delete test"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-danger)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = 'var(--color-danger)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(239, 68, 68, 0.1)';
          }}
        >
          <TrashIcon className="h-3.5 w-3.5 mr-1.5" />
          Delete
        </button>
      )}
    </div>
  );
};

export default TestActions;
