import React from 'react';
import { FILTER_FIELDS } from '@/constants/vocabulary';

const VocabularyFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories,
  difficultyLevels,
  partsOfSpeech 
}) => {
  const renderFilterField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.key}
            value={filters[field.key]}
            onChange={(e) => onFilterChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      
      case 'select':
        const options = getOptionsForField(field.key);
        return (
          <select
            id={field.key}
            value={filters[field.key]}
            onChange={(e) => onFilterChange(field.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">{field.placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  const getOptionsForField = (fieldKey) => {
    switch (fieldKey) {
      case 'difficulty':
        return difficultyLevels;
      case 'category':
        return categories;
      case 'partOfSpeech':
        return partsOfSpeech;
      default:
        return [];
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FILTER_FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {renderFilterField(field)}
          </div>
        ))}
      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default VocabularyFilters;
