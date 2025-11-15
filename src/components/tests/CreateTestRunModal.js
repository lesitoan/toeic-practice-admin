'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import testsService from '@/services/tests.service';

export default function CreateTestRunModal({ isOpen, onClose, test, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    mode: 1,
    start_at: '',
    end_at: '',
    duration_sec: 0,
    attempt_limit: 1,
    grace_sec: 0,
    scope: 1,
    class_id: '',
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.isPublic && !formData.class_id) {
      toast.error('Please enter a class ID or select Public');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        test_template_id: test.id,
        mode: formData.mode,
        start_at: formData.start_at || null,
        end_at: formData.end_at || null,
        duration_sec: formData.duration_sec,
        attempt_limit: formData.attempt_limit,
        grace_sec: formData.grace_sec,
        scope: formData.scope,
      };

      // Only include class_id if not public
      if (!formData.isPublic && formData.class_id) {
        payload.class_id = parseInt(formData.class_id);
      }

      const response = await testsService.createTestRun(payload);
      
      toast.success('Test run created successfully!');
      onSuccess?.(response);
      handleClose();
    } catch (error) {
      console.error('Create test run error:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create test run. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      mode: 1,
      start_at: '',
      end_at: '',
      duration_sec: 0,
      attempt_limit: 1,
      grace_sec: 0,
      scope: 1,
      class_id: '',
      isPublic: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Test Run</h2>
              <p className="text-sm text-gray-500 mt-1">Test: {test?.name || 'N/A'}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter test run title"
                  required
                />
              </div>

              {/* Mode */}
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Mode 1</option>
                  <option value={2}>Mode 2</option>
                  <option value={3}>Mode 3</option>
                </select>
              </div>

              {/* Scope */}
              <div>
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                  Scope
                </label>
                <select
                  id="scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Scope 1</option>
                  <option value={2}>Scope 2</option>
                  <option value={3}>Scope 3</option>
                </select>
              </div>

              {/* Public/Class ID */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Public</span>
                </label>
                {!formData.isPublic && (
                  <div>
                    <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Class ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="class_id"
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter class ID"
                      required={!formData.isPublic}
                    />
                  </div>
                )}
              </div>

              {/* Start At */}
              <div>
                <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Start At
                </label>
                <input
                  type="datetime-local"
                  id="start_at"
                  name="start_at"
                  value={formData.start_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* End At */}
              <div>
                <label htmlFor="end_at" className="block text-sm font-medium text-gray-700 mb-1">
                  End At
                </label>
                <input
                  type="datetime-local"
                  id="end_at"
                  name="end_at"
                  value={formData.end_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Duration (seconds) */}
              <div>
                <label htmlFor="duration_sec" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  id="duration_sec"
                  name="duration_sec"
                  value={formData.duration_sec}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Attempt Limit */}
              <div>
                <label htmlFor="attempt_limit" className="block text-sm font-medium text-gray-700 mb-1">
                  Attempt Limit
                </label>
                <input
                  type="number"
                  id="attempt_limit"
                  name="attempt_limit"
                  value={formData.attempt_limit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Grace Period (seconds) */}
              <div>
                <label htmlFor="grace_sec" className="block text-sm font-medium text-gray-700 mb-1">
                  Grace Period (seconds)
                </label>
                <input
                  type="number"
                  id="grace_sec"
                  name="grace_sec"
                  value={formData.grace_sec}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Test Run'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

