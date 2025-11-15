import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const TestActions = ({ test, onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(test)}
        className="text-blue-600 hover:text-blue-900"
        title="View test"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onEdit(test)}
        className="text-blue-600 hover:text-blue-900 text-sm"
        title="Edit test"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(test)}
        className="text-red-600 hover:text-red-900 text-sm"
        title="Delete test"
      >
        Delete
      </button>
    </div>
  );
};

export default TestActions;
