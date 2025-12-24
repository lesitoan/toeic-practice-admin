'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import classesService from '@/services/classes.service';

export default function ClassStudentsView({ classItem, onBack, onUpdate, onDelete, onRefresh }) {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.error('Class ID not found in classItem:', classItem);
        toast.error('Invalid class data. Please try again.');
        return;
      }

      console.log('Fetching class data for ID:', classId);
      
      setLoading(true);
      const response = await classesService.getClassById(classId, pagination.page, pagination.limit);
      
      // Ensure response has id field
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
      console.error('Error fetching class data:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to load class details. Please try again.';
      toast.error(message);
      setClassData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const students = classData?.members?.items || [];
  const teacher = classData?.teacher;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Classes
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {classData?.name || classItem?.name || `Class ${classItem?.id || classItem?.class_id}`}
            </h1>
            {teacher && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Teacher: {teacher.name} ({teacher.email})
              </p>
            )}
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {classData?.members_count || 0} {classData?.members_count === 1 ? 'student' : 'students'}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate(classData || classItem)}
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
            Update Class
          </button>
          <button
            type="button"
            onClick={() => onDelete(classData || classItem)}
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            Delete Class
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="card-block">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Students ({pagination.total || students.length})
          </h2>
        </div>
        {loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No students in this class yet.</p>
            <p className="text-sm text-gray-400 mt-2">Update the class to add students.</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li key={student.user_id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {(student.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.name || 'Unknown Student'}
                          </p>
                          {student.email && (
                            <p className="text-sm text-gray-500">{student.email}</p>
                          )}
                          {student.joined_at && (
                            <p className="text-xs text-gray-400 mt-1">
                              Joined: {new Date(student.joined_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            {(pagination.has_more || pagination.page > 1) && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_more}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

