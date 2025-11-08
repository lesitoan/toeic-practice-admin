'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

export default function UserDetailModal({ 
  user, 
  isOpen, 
  onClose,
  loading = false
}) {
  if (!isOpen) return null;

  // Map gender number to text
  const getGenderText = (gender) => {
    switch (gender) {
      case 1:
        return 'Male';
      case 2:
        return 'Female';
      case 3:
        return 'Other';
      default:
        return 'Not specified';
    }
  };

  // Map role_id to role name
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'Staff';
      case 3:
        return 'Student';
      default:
        return 'User';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading user details...</span>
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-blue-700">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{user.name || 'N/A'}</h3>
                    <p className="text-sm text-gray-500">{user.email || 'N/A'}</p>
                  </div>
                </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{user.name || 'Not specified'}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{user.email || 'Not specified'}</p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role_id === 1 ? 'bg-purple-100 text-purple-800' :
                    user.role_id === 2 ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getRoleName(user.role_id)}
                  </span>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Gender
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.gender !== null && user.gender !== undefined 
                      ? getGenderText(user.gender) 
                      : 'Not specified'}
                  </p>
                </div>

                {/* Age/Birthday */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Age / Birthday
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.age ? formatDate(user.age) : 'Not specified'}
                  </p>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Level
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.level || 'Not specified'}
                  </p>
                </div>

                {/* Study At */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Study At
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.study_at || 'Not specified'}
                  </p>
                </div>
              </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No user data available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

