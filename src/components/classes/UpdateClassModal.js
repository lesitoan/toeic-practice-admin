'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import classesService from '@/services/classes.service';
import usersService from '@/services/users.service';

export default function UpdateClassModal({ classItem, isOpen, onClose, onSave }) {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [currentMembers, setCurrentMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [selectedMembersToRemove, setSelectedMembersToRemove] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen && classItem) {
      loadClassData();
    }
  }, [isOpen, classItem]);

  const loadClassData = async () => {
    if (!classItem) return;

    const classId = classItem.id || classItem.class_id || classItem.ID;
    if (!classId) {
      toast.error('Invalid class data');
      return;
    }

    setClassName(classItem.name || classItem.class_name || '');
    setDescription(classItem.description || '');
    setSelectedUsersToAdd([]);
    setSelectedMembersToRemove([]);

    // Load current members
    setLoadingMembers(true);
    let members = [];
    try {
      const membersResponse = await classesService.getClassMembers(classId);
      members = Array.isArray(membersResponse)
        ? membersResponse
        : membersResponse.items || membersResponse.data || [];
      setCurrentMembers(members);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load class members');
    } finally {
      setLoadingMembers(false);
    }

    // Load available users
    setLoadingUsers(true);
    try {
      const usersResponse = await usersService.getAllUsers();
      const users = Array.isArray(usersResponse)
        ? usersResponse
        : usersResponse.items || usersResponse.data || [];
      // Filter out users who are already members
      const memberIds = members.map((m) => m.id || m.user_id);
      const available = users.filter((u) => !memberIds.includes(u.id));
      setAvailableUsers(available);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load available users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    const classId = classItem.id || classItem.class_id || classItem.ID;
    if (!classId) {
      toast.error('Invalid class data');
      return;
    }

    setIsLoading(true);
    try {
      // Update class info
      await classesService.updateClass(classId, {
        name: className.trim(),
        description: description.trim() || null,
      });

      // Add new members
      if (selectedUsersToAdd.length > 0) {
        const userIdsToAdd = selectedUsersToAdd.map((u) => u.id);
        await classesService.addMembers(classId, userIdsToAdd);
      }

      // Remove members
      if (selectedMembersToRemove.length > 0) {
        const userIdsToRemove = selectedMembersToRemove.map((m) => m.id || m.user_id);
        await classesService.removeMembers(classId, userIdsToRemove);
      }

      toast.success('Class updated successfully');
      onSave();
    } catch (error) {
      console.error('Error updating class:', error);
      const message =
        error?.response?.data?.message || error?.message || 'Failed to update class. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAddUser = (user) => {
    setSelectedUsersToAdd((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleToggleRemoveMember = (member) => {
    setSelectedMembersToRemove((prev) => {
      const memberId = member.id || member.user_id;
      const isSelected = prev.some((m) => (m.id || m.user_id) === memberId);
      if (isSelected) {
        return prev.filter((m) => (m.id || m.user_id) !== memberId);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleClose = () => {
    setClassName('');
    setDescription('');
    setCurrentMembers([]);
    setAvailableUsers([]);
    setSelectedUsersToAdd([]);
    setSelectedMembersToRemove([]);
    onClose();
  };

  if (!isOpen || !classItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Update Class</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-6">
              {/* Class Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Class Information</h3>
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
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter class description (optional)"
                  />
                </div>
              </div>

              {/* Current Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Current Members ({currentMembers.length})
                  </h3>
                  {selectedMembersToRemove.length > 0 && (
                    <span className="text-sm text-red-600">
                      {selectedMembersToRemove.length} selected for removal
                    </span>
                  )}
                </div>
                {loadingMembers ? (
                  <p className="text-sm text-gray-500">Loading members...</p>
                ) : currentMembers.length === 0 ? (
                  <p className="text-sm text-gray-500">No members in this class.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {currentMembers.map((member) => {
                        const memberId = member.id || member.user_id;
                        const isSelected = selectedMembersToRemove.some(
                          (m) => (m.id || m.user_id) === memberId
                        );
                        return (
                          <li
                            key={memberId}
                            className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
                              isSelected ? 'bg-red-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/image/defaultAvt.jpg';
                                  }}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 text-xs font-medium">
                                    {(member.name || member.user_name || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {member.name || member.user_name || 'Unknown'}
                                </p>
                                {member.email && (
                                  <p className="text-xs text-gray-500">{member.email}</p>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleRemoveMember(member)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                isSelected
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Remove'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Add Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add Members ({availableUsers.length} available)
                  </h3>
                  {selectedUsersToAdd.length > 0 && (
                    <span className="text-sm text-blue-600">
                      {selectedUsersToAdd.length} selected to add
                    </span>
                  )}
                </div>
                {loadingUsers ? (
                  <p className="text-sm text-gray-500">Loading users...</p>
                ) : availableUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">No available users to add.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {availableUsers.map((user) => {
                        const isSelected = selectedUsersToAdd.some((u) => u.id === user.id);
                        return (
                          <li
                            key={user.id}
                            className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/image/defaultAvt.jpg';
                                  }}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 text-xs font-medium">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.name || 'Unknown'}
                                </p>
                                {user.email && (
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleAddUser(user)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Add'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
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
                {isLoading ? 'Updating...' : 'Update Class'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

