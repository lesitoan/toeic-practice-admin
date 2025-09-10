'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersStatsCards from '@/components/users/UsersStatsCards';
import UsersChartsSection from '@/components/users/UsersChartsSection';
import UsersTable from '@/components/users/UsersTable';
import { MOCK_USERS } from '@/constants/users';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
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
        <UsersChartsSection />

        {/* Users Table */}
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}