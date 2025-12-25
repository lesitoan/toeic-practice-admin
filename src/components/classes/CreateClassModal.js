'use client';

import { useState } from 'react';
import { XMarkIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import classesService from '@/services/classes.service';
import usersService from '@/services/users.service';

export default function CreateClassModal({ isOpen, onClose, onSave }) {
  const [className, setClassName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [studentEmails, setStudentEmails] = useState([]);
  const [emailErrors, setEmailErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);

  // Parse emails from input (comma or newline separated)
  const parseEmails = (input) => {
    return input
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Find user ID by email
  const findUserIdByEmail = async (email) => {
    try {
      const users = await usersService.getAllUsers();
      const usersList = Array.isArray(users) ? users : users.items || users.data || [];
      const user = usersList.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      return user ? user.id : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  };

  const handleAddEmail = () => {
    if (!emailInput.trim()) return;

    const emails = parseEmails(emailInput);
    const newEmails = [];
    const newErrors = { ...emailErrors };

    emails.forEach((email) => {
      if (!isValidEmail(email)) {
        newErrors[email] = 'Invalid email format';
        return;
      }
      if (studentEmails.includes(email)) {
        newErrors[email] = 'Email already added';
        return;
      }
      newEmails.push(email);
      delete newErrors[email];
    });

    setStudentEmails([...studentEmails, ...newEmails]);
    setEmailErrors(newErrors);
    setEmailInput('');
  };

  const handleRemoveEmail = (email) => {
    setStudentEmails(studentEmails.filter((e) => e !== email));
    const newErrors = { ...emailErrors };
    delete newErrors[email];
    setEmailErrors(newErrors);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    if (studentEmails.length === 0) {
      toast.error('Please add at least one student email');
      return;
    }

    setIsLoading(true);
    setIsValidatingEmails(true);

    try {
      // Find user IDs for all emails
      const userIdPromises = studentEmails.map((email) => findUserIdByEmail(email));
      const userIds = await Promise.all(userIdPromises);

      // Check for emails that don't have corresponding users
      const invalidEmails = [];
      const validUserIds = [];
      studentEmails.forEach((email, index) => {
        if (userIds[index]) {
          validUserIds.push(userIds[index]);
        } else {
          invalidEmails.push(email);
        }
      });

      if (invalidEmails.length > 0) {
        toast.error(
          `The following emails were not found: ${invalidEmails.join(', ')}. Please check and try again.`
        );
        setIsLoading(false);
        setIsValidatingEmails(false);
        return;
      }

      // Create class with student IDs
      const response = await classesService.createClass({
        id : 0,
        name: className.trim(),
        student_ids: validUserIds,
      });

      toast.success('Class created successfully');
      setClassName('');
      setEmailInput('');
      setStudentEmails([]);
      setEmailErrors({});
      onSave();
    } catch (error) {
      console.error('Error creating class:', error);
      const message =
        error?.response?.data?.message || error?.message || 'Failed to create class. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsValidatingEmails(false);
    }
  };

  const handleClose = () => {
    setClassName('');
    setEmailInput('');
    setStudentEmails([]);
    setEmailErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create New Class</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Class Name */}
              <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter class name"
                  required
                />
              </div>

              {/* Student Emails */}
              <div>
                <label htmlFor="studentEmails" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Emails <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="studentEmails"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email addresses (comma or newline separated)"
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter email addresses separated by commas or press Enter after each email
                  </p>

                  {/* Added Emails List */}
                  {studentEmails.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {studentEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
                        >
                          <span className="text-sm text-gray-700">{email}</span>
                          {emailErrors[email] ? (
                            <span className="text-xs text-red-600">{emailErrors[email]}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (isValidatingEmails ? 'Validating emails...' : 'Creating...') : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

