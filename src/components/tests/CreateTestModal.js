'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PartEditor from './PartEditor';
import testsService from '@/services/tests.service';

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
  const [testDescription, setTestDescription] = useState('');
  const [testStatus, setTestStatus] = useState('draft');
  const [selectedPart, setSelectedPart] = useState(null);
  const [partsData, setPartsData] = useState({});
  const [testTemplateId, setTestTemplateId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState(null);

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
    setTestDescription('');
    setTestStatus('draft');
    setSelectedPart(null);
    setPartsData({});
    setTestTemplateId(null);
    setInitError(null);
    onClose();
  };

  const initializeDraftTest = async () => {
    setIsInitializing(true);
    setInitError(null);
    try {
      const response = await testsService.createDraftTest('default');
      setTestTemplateId(response.test_template_id);
    } catch (error) {
      console.error('Failed to initialize draft test:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to initialize draft test. Please try again.';
      setInitError(message);
      toast.error(message);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeDraftTest();
    } else {
      setTestTemplateId(null);
      setInitError(null);
      setPartsData({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCreateTest = () => {
    if (!testName.trim()) {
      alert('Please enter a test name');
      return;
    }

    if (!testTemplateId) {
      toast.error('Test template is not ready yet. Please wait a moment and try again.');
      return;
    }

    const testData = {
      name: testName,
      description: testDescription,
      status: testStatus,
      templateId: testTemplateId,
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
        testTemplateId={testTemplateId}
        templateMeta={{
          name: testName,
          description: testDescription,
          status: testStatus,
        }}
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
            {/* Template Status */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">Test Template</p>
                  {testTemplateId ? (
                    <p className="text-gray-500">Template ID: {testTemplateId}</p>
                  ) : (
                    <p className="text-gray-500">
                      {isInitializing
                        ? 'Initializing draft test...'
                        : initError
                          ? 'Initialization failed'
                          : 'Waiting for initialization'}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={initializeDraftTest}
                  disabled={isInitializing}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-1 ${isInitializing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              {initError && (
                <p className="mt-2 text-sm text-red-600">
                  {initError}
                </p>
              )}
            </div>

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

            {/* Description Field */}
            <div className="mb-6">
              <label htmlFor="testDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="testDescription"
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Short description for this template"
              />
            </div>

            {/* Status Field */}
            <div className="mb-6">
              <label htmlFor="testStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="testStatus"
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
              </select>
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
                        disabled={!testTemplateId || isInitializing}
                        className="ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

