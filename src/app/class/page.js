'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import classesService from '@/services/classes.service';
import CreateClassModal from '@/components/classes/CreateClassModal';
import UpdateClassModal from '@/components/classes/UpdateClassModal';
import ClassStudentsView from '@/components/classes/ClassStudentsView';

export default function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    has_more: false,
  });

  // Fetch classes from API
  const fetchClasses = async (page = pagination.page) => {
    try {
      setLoading(true);
      const response = await classesService.getAllClasses(page, pagination.limit);
      
      // Response format: { total, items, page, limit, has_more, next_cursor, order }
      const classesList = response.items || [];
      
      // Log to debug class structure
      if (classesList.length > 0) {
        console.log('Sample class item structure:', classesList[0]);
        console.log('Full response:', response);
      }
      
      // Update pagination state
      setPagination((prev) => ({
        ...prev,
        page: response.page || page,
        total: response.total || 0,
        has_more: response.has_more || false,
      }));
      
      // Note: Response items may not have 'id' field, only 'name' and 'student_ids'
      // We'll need to handle this when selecting a class
      setClasses(classesList);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes. Please try again.');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = () => {
    setIsCreateModalOpen(true);
  };

  const handleClassCreated = () => {
    fetchClasses();
    setIsCreateModalOpen(false);
  };

  const handleSelectClass = async (classItem) => {
    try {
      // Get class ID - check multiple possible field names
      // Note: Response from getAllClasses may not have 'id', only 'name'
      // We might need to use name or find another way to get the ID
      const classId = classItem.id || classItem.class_id || classItem.ID;
      
      if (!classId) {
        console.error('Class ID not found in classItem:', classItem);
        console.log('Available fields:', Object.keys(classItem));
        // If no ID, we might need to search by name or use index
        // For now, show error and log the structure
        toast.error('Class ID not available. Please check the API response structure.');
        return;
      }

      console.log('Selecting class with ID:', classId);
      
      // Fetch full class details with members
      const classDetails = await classesService.getClassById(classId, 1, 20);
      // Ensure classDetails has id field
      if (classDetails && !classDetails.id) {
        classDetails.id = classId;
      }
      setSelectedClass(classDetails);
    } catch (error) {
      console.error('Error selecting class:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to load class details.';
      toast.error(message);
    }
  };

  const handleUpdateClass = (classItem) => {
    setEditingClass(classItem);
    setIsUpdateModalOpen(true);
  };

  const handleClassUpdated = () => {
    fetchClasses();
    setIsUpdateModalOpen(false);
    setEditingClass(null);
    // Refresh selected class if it was the one being updated
    if (selectedClass && editingClass) {
      const selectedClassId = selectedClass.id || selectedClass.class_id || selectedClass.ID;
      const editingClassId = editingClass.id || editingClass.class_id || editingClass.ID;
      if (selectedClassId === editingClassId) {
        classesService.getClassById(selectedClassId, 1, 20).then((updated) => {
          if (updated && !updated.id) {
            updated.id = selectedClassId;
          }
          setSelectedClass(updated);
        });
      }
    }
  };

  const handleDeleteClass = async (classItem) => {
    if (!confirm(`Are you sure you want to delete "${classItem.name || classItem.class_name}"?`)) {
      return;
    }

    try {
      const classId = classItem.id || classItem.class_id || classItem.ID;
      if (!classId) {
        toast.error('Invalid class data. Cannot delete.');
        return;
      }
      
      await classesService.deleteClass(classId);
      toast.success('Class deleted successfully');
      fetchClasses();
      // If deleted class is currently selected, clear selection
      if (selectedClass) {
        const selectedClassId = selectedClass.id || selectedClass.class_id || selectedClass.ID;
        if (selectedClassId === classId) {
          setSelectedClass(null);
        }
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class. Please try again.');
    }
  };

  const handleBackToList = () => {
    setSelectedClass(null);
  };

  // If a class is selected, show students view
  if (selectedClass) {
    return (
      <DashboardLayout>
        <ClassStudentsView
          classItem={selectedClass}
          onBack={handleBackToList}
          onUpdate={() => handleUpdateClass(selectedClass)}
          onDelete={() => handleDeleteClass(selectedClass)}
          onRefresh={fetchClasses}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Classes
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Manage classes and their students
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleCreateClass}
              className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Class
            </button>
          </div>
        </div>

        {/* Classes List */}
        <div className="card-block">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No classes found. Create your first class to get started.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {classes.map((classItem, index) => {
                  const classId = classItem.id || classItem.class_id || classItem.ID;
                  return (
                    <li
                      key={classId || `class-${index}-${classItem.name}`}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleSelectClass(classItem)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {classItem.name || classItem.class_name || `Class ${classId}`}
                          </h3>
                          {classItem.description && (
                            <p className="mt-1 text-sm text-gray-500">{classItem.description}</p>
                          )}
                          {classItem.student_count !== undefined && (
                            <p className="mt-1 text-xs text-gray-400">
                              {classItem.student_count} {classItem.student_count === 1 ? 'student' : 'students'}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateClass(classItem);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Update
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(classItem);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Pagination */}
          {!loading && classes.length > 0 && (pagination.has_more || pagination.page > 1) && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1} ({pagination.total} total)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchClasses(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchClasses(pagination.page + 1)}
                  disabled={!pagination.has_more}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Class Modal */}
        <CreateClassModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleClassCreated}
        />

        {/* Update Class Modal */}
        <UpdateClassModal
          classItem={editingClass}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setEditingClass(null);
          }}
          onSave={handleClassUpdated}
        />
      </div>
    </DashboardLayout>
  );
}

