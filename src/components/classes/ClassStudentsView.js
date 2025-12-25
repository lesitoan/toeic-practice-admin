'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, UserMinusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from '@/utils/toast';
import classesService from '@/services/classes.service';
import usersService from '@/services/users.service';

export default function ClassStudentsView({ classItem, onBack, onUpdate, onDelete, onRefresh }) {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    has_more: false,
  });

  useEffect(() => {
    const classId = classItem?.id || classItem?.class_id || classItem?.ID;
    if (classId) {
      fetchClassData();
    }
  }, [classItem, pagination.page]);

  const fetchClassData = async () => {
    try {
      const classId = classItem?.id || classItem?.class_id || classItem?.ID;
      if (!classId) {
        return;
      }

      setLoading(true);
      const response = await classesService.getClassById(classId, pagination.page, pagination.limit);
      
      if (response && !response.id) {
        response.id = classId;
      }
      
      setClassData(response);
      if (response.members) {
        setPagination((prev) => ({
          ...prev,
          total: response.members.total || 0,
          has_more: response.members.has_more || false,
        }));
      }
    } catch (error) {
      setClassData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenAddMemberModal = async () => {
    setIsAddMemberModalOpen(true);
    try {
      const usersResponse = await usersService.getAllUsers();
      const users = Array.isArray(usersResponse) 
        ? usersResponse 
        : usersResponse.items || usersResponse.data || [];
      
      // Filter out users who are already members
      const currentMemberIds = (classData?.members?.items || []).map(m => m.user_id);
      const available = users.filter(u => !currentMemberIds.includes(u.id));
      
      setAvailableUsers(available);
    } catch (error) {
      // Error handled silently
    }
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      return;
    }

    const classId = classData?.id || classItem?.id || classItem?.class_id || classItem?.ID;
    if (!classId) {
      return;
    }

    setIsAddingMembers(true);
    try {
      await classesService.addMembers(classId, selectedUserIds);
      toast.success(`Successfully added ${selectedUserIds.length} member(s)`);
      setIsAddMemberModalOpen(false);
      setSelectedUserIds([]);
      await fetchClassData();
      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handled silently
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    const classId = classData?.id || classItem?.id || classItem?.class_id || classItem?.ID;
    if (!classId) {
      return;
    }

    try {
      await classesService.removeMembers(classId, [userId]);
      toast.success('Student removed successfully');
      await fetchClassData();
      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handled silently
    }
  };

  const handleDeleteClass = async () => {
    if (!confirm(`Are you sure you want to delete "${classData?.name || classItem?.name}"? This action cannot be undone.`)) {
      return;
    }

    const classId = classData?.id || classItem?.id || classItem?.class_id || classItem?.ID;
    if (!classId) {
      return;
    }

    setIsDeleting(true);
    try {
      await classesService.deleteClass(classId);
      toast.success('Class deleted successfully');
      if (onDelete) {
        onDelete(classData || classItem);
      }
      if (onBack) {
        onBack();
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setIsDeleting(false);
    }
  };

  const students = classData?.members?.items || [];
  const teacher = classData?.teacher;
  const classId = classData?.id || classItem?.id || classItem?.class_id || classItem?.ID;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
      </button>

      {/* Modern Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {classData?.name || classItem?.name || `Class ${classId}`}
              </h1>
              {classId && (
                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  ID: {classId}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-4">
              {teacher && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {(teacher.name || 'T').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teacher</p>
                    <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {classData?.members_count || 0}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-sm font-medium text-gray-900">
                    {classData?.members_count || 0} {classData?.members_count === 1 ? 'student' : 'students'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={() => onUpdate(classData || classItem)}
              className="inline-flex items-center justify-center rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDeleteClass}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Students ({pagination.total || students.length})
          </h2>
          <button
            type="button"
            onClick={handleOpenAddMemberModal}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Students
          </button>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No students in this class yet</p>
            <p className="text-sm text-gray-400 mt-2">Click "Add Students" to add students to this class</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {students.map((student) => (
                <div key={student.user_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-lg">
                          {(student.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.name || 'Unknown Student'}
                        </p>
                        {student.email && (
                          <p className="text-sm text-gray-500 mt-0.5">{student.email}</p>
                        )}
                        {student.joined_at && (
                          <p className="text-xs text-gray-400 mt-1">
                            Joined {new Date(student.joined_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(student.user_id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      <UserMinusIcon className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(pagination.has_more || pagination.page > 1) && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_more}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/50" onClick={() => setIsAddMemberModalOpen(false)} />
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add Students to Class</h2>
                <button
                  onClick={() => {
                    setIsAddMemberModalOpen(false);
                    setSelectedUserIds([]);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {availableUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No available users to add</p>
                ) : (
                  <div className="space-y-2">
                    {availableUsers.map((user) => {
                      const isSelected = selectedUserIds.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                            } else {
                              setSelectedUserIds([...selectedUserIds, user.id]);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {(user.name || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
                                {user.email && (
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMemberModalOpen(false);
                    setSelectedUserIds([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMembers}
                  disabled={isAddingMembers || selectedUserIds.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingMembers ? 'Adding...' : `Add ${selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
