'use client';

import { useState } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import PartEditor from './PartEditor';

// TOEIC Test Parts
const TOEIC_PARTS = [
  { id: 1, name: 'Part 1: Photographs', description: 'Listening - Photographs' },
  { id: 2, name: 'Part 2: Question-Response', description: 'Listening - Question-Response' },
  { id: 3, name: 'Part 3: Conversations', description: 'Listening - Conversations' },
  { id: 4, name: 'Part 4: Short Talks', description: 'Listening - Short Talks' },
  { id: 5, name: 'Part 5: Incomplete Sentences', description: 'Reading - Incomplete Sentences' },
  { id: 6, name: 'Part 6: Text Completion', description: 'Reading - Text Completion' },
  { id: 7, name: 'Part 7: Reading Comprehension', description: 'Reading - Reading Comprehension' },
];

export default function CreateTestModal({ isOpen, onClose, onSave }) {
  const [testName, setTestName] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [partsData, setPartsData] = useState({});

  const handleEditPart = (part) => {
    setSelectedPart(part);
  };

  const handleSavePart = (partId, partData) => {
    setPartsData(prev => ({
      ...prev,
      [partId]: partData
    }));
    setSelectedPart(null);
  };

  const handleClose = () => {
    setTestName('');
    setSelectedPart(null);
    setPartsData({});
    onClose();
  };

  const handleCreateTest = () => {
    if (!testName.trim()) {
      alert('Please enter a test name');
      return;
    }

    const testData = {
      name: testName,
      parts: partsData
    };

    onSave(testData);
    handleClose();
  };

  if (!isOpen) return null;

  // If a part is selected, show the part editor
  if (selectedPart) {
    return (
      <PartEditor
        part={selectedPart}
        initialData={partsData[selectedPart.id] || {}}
        onSave={(data) => handleSavePart(selectedPart.id, data)}
        onClose={() => setSelectedPart(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create New Test</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Test Name Field */}
            <div className="mb-6">
              <label htmlFor="testName" className="block text-sm font-medium text-gray-700 mb-2">
                Test Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test name (e.g., TOEIC Practice Test 1)"
              />
            </div>

            {/* Parts List */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                TOEIC Test Parts
              </label>
              <div className="space-y-2">
                {TOEIC_PARTS.map((part) => {
                  const hasData = partsData[part.id];
                  return (
                    <div
                      key={part.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">{part.name}</h3>
                          {hasData && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Configured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                      </div>
                      <button
                        onClick={() => handleEditPart(part)}
                        className="ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        {hasData ? 'Edit' : 'Configure'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTest}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

