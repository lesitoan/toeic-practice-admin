'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import usersService from '@/services/users.service';

export default function EditUserModal({ 
  user, 
  isOpen, 
  onClose, 
  onSave 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      gender: 3,
      age: '',
      password: '',
      role_id: 3
    }
  });

  // Fetch user details when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadUserDetail();
    }
  }, [isOpen, user]);

  const loadUserDetail = async () => {
    try {
      setLoadingDetail(true);
      const detail = await usersService.getUserById(user.id);
      setUserDetail(detail);
      
      // Populate form with user data
      if (detail) {
        setValue('name', detail.name || '');
        setValue('gender', detail.gender !== null && detail.gender !== undefined ? detail.gender : 3);
        
        // Format age date for date input (YYYY-MM-DD)
        if (detail.age) {
          try {
            const date = new Date(detail.age);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setValue('age', `${year}-${month}-${day}`);
            } else {
              // If it's already in YYYY-MM-DD format, use it directly
              setValue('age', detail.age);
            }
          } catch (error) {
            // If parsing fails, try to use the value as-is if it's in YYYY-MM-DD format
            if (typeof detail.age === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(detail.age)) {
              setValue('age', detail.age);
            } else {
              setValue('age', '');
            }
          }
        } else {
          setValue('age', '');
        }
        
        setValue('role_id', detail.role_id || 3);
        // Don't set password - leave it empty for user to optionally change
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Prepare request body - only include password if it's provided
      const requestBody = {
        name: data.name,
        gender: data.gender,
        age: data.age,
        role_id: data.role_id
      };

      // Only include password if user provided a new one
      if (data.password && data.password.trim() !== '') {
        requestBody.password = data.password;
      }

      await usersService.updateUser(user.id, requestBody);
      toast.success('User updated successfully');
      onSave();
      onClose();
      reset();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={handleClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading user details...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter user name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                    <option value={3}>Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                {/* Age/Birthday */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age / Birthday
                  </label>
                  <input
                    type="date"
                    id="age"
                    {...register('age')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                {/* Password (Optional) */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password (leave blank to keep current password)
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password (optional)"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank if you don't want to change the password
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role_id"
                    {...register('role_id', { required: 'Role is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Staff</option>
                    <option value={3}>Student</option>
                  </select>
                  {errors.role_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.role_id.message}</p>
                  )}
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
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

