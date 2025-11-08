'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersStatsCards from '@/components/users/UsersStatsCards';
import UsersChartsSection from '@/components/users/UsersChartsSection';
import UsersTable from '@/components/users/UsersTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import usersService from '@/services/users.service';
import { toast } from 'react-toastify';

import UserDetailModal from '@/components/users/UserDetailModal';
import EditUserModal from '@/components/users/EditUserModal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // Fetch users from API
  const fetchUsers = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await usersService.getUsersPaginated(page, limit);

      // API format: { total, items, page, limit }
      if (response && Array.isArray(response.items)) {
        const mapped = response.items.map((u) => {
          // Debug: Log user data to check avatar field
          if (u.avatar) {
            console.log('User avatar found:', u.name, u.avatar);
          }
          
          return {
            id: u.id,
            name: u.name || '-',
            email: u.email || '-',
            avatar: u.avatar || null, // Include avatar from API
            // Preserve raw API data for charts
            gender: u.gender,
            age: u.age,
            role_id: u.role_id,
            is_active: u.is_active,
            deleted_by: u.deleted_by,
            deleted_at: u.deleted_at,
            // derive UI fields expected by USER_COLUMNS
            status: u.deleted_at ? 'Inactive' : 'Active',
            lastLogin: '-', // No updated_at in API response
            testsTaken: '-',
            averageScore: '-',
            joinDate: '-', // No created_at in API response
          };
        });
        setUsers(mapped);
        setPagination({
          page: response.page ?? page,
          limit: response.limit ?? limit,
          total: response.total ?? mapped.length,
        });
      } else if (Array.isArray(response)) {
        setUsers(response);
        setPagination(prev => ({ ...prev, page, limit, total: response.length }));
      } else if (response?.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          page,
          limit,
          total: response.pagination?.totalItems || response.data.length,
        }));
      } else {
        console.warn('Unexpected API response format:', response);
        setUsers([]);
      }
    } catch (error) {
      // console.error('Error fetching users:', error);
      
      // Handle different error types
      // if (error.response?.status === 401) {
      //   toast.error('Authentication failed. Please login again.');
      //   // The axios interceptor will handle redirecting to login
      // } else if (error.response?.status === 403) {
      //   toast.error('Access denied. You do not have permission to view users.');
      // } else if (error.response?.status === 422) {
      //   toast.error('Invalid request parameters. Please check your filters.');
      // } else {
      //   toast.error('Failed to fetch users. Please try again.');
      // }
      
      // setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    toast.success('User updated successfully');
    fetchUsers(pagination.page, pagination.limit); // Refresh the list
  };

  const handleViewDetail = async (user) => {
    try {
      setLoadingDetail(true);
      setSelectedUser(user);
      setIsDetailModalOpen(true);
      
      // Fetch detailed user information from API
      const detail = await usersService.getUserById(user.id);
      setUserDetail(detail);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details. Please try again.');
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleRestore = async (user) => {
    if (confirm(`Are you sure you want to restore ${user.name}?`)) {
      try {
        await usersService.restoreUser(user.id);
        toast.success('User restored successfully');
        fetchUsers(pagination.page, pagination.limit); // Refresh the list
      } catch (error) {
        console.error('Error restoring user:', error);
        toast.error('Failed to restore user. Please try again.');
      }
    }
  };

  const handleDelete = async (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await usersService.deleteUser(user.id);
        toast.success('User deleted successfully');
        fetchUsers(pagination.page, pagination.limit); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user. Please try again.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pagination.limit);
  };

  const handleLimitChange = (newLimit) => {
    fetchUsers(1, newLimit);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage student accounts and monitor their progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <UsersStatsCards users={users} />

        {/* Charts Section */}
        <UsersChartsSection users={users} />

        {/* Users Table */}
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
          onRestore={handleRestore}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />

        {/* User Detail Modal */}
        <UserDetailModal
          user={userDetail}
          isOpen={isDetailModalOpen}
          loading={loadingDetail}
          onClose={() => {
            setIsDetailModalOpen(false);
            setUserDetail(null);
            setSelectedUser(null);
          }}
        />

        {/* Edit User Modal */}
        <EditUserModal
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      </div>
    </DashboardLayout>
  );
}