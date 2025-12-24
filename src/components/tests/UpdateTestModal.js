'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function UpdateTestModal({ isOpen, onClose, test, onSave }) {
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testStatus, setTestStatus] = useState('draft');

  useEffect(() => {
    if (test) {
      setTestName(test.name || test.title || '');
      setTestDescription(test.description || '');
      setTestStatus(test.status || 'draft');
    }
  }, [test]);

  const handleClose = () => {
    setTestName('');
    setTestDescription('');
    setTestStatus('draft');
    onClose();
  };

  const handleSave = () => {
    if (!testName.trim()) {
      toast.error('Please enter a test name');
      return;
    }

    const updatedTest = {
      ...test,
      name: testName,
      title: testName,
      description: testDescription,
      status: testStatus,
    };

    onSave(updatedTest);
    handleClose();
  };

  if (!isOpen || !test) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Edit Test</h2>
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
                placeholder="Enter test name"
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
                placeholder="Enter test description"
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

            {/* Test ID (read-only) */}
            {test.id && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test ID
                </label>
                <p className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  {test.id}
                </p>
              </div>
            )}

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
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{backgroundColor: 'var(--color-primary)'}}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

