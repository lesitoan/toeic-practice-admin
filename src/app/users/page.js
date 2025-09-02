'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import NewUsersChart from '@/components/charts/NewUsersChart';
import UserActivityChart from '@/components/charts/UserActivityChart';
import UserGrowthChart from '@/components/charts/UserGrowthChart';
import { PlusIcon } from '@heroicons/react/24/outline';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 14:30',
    testsTaken: 12,
    averageScore: '85%',
    joinDate: '2023-09-15',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 16:45',
    testsTaken: 8,
    averageScore: '78%',
    joinDate: '2023-10-20',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    status: 'Inactive',
    lastLogin: '2024-01-10 09:15',
    testsTaken: 15,
    averageScore: '92%',
    joinDate: '2023-08-05',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 11:20',
    testsTaken: 5,
    averageScore: '72%',
    joinDate: '2023-11-12',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    status: 'Active',
    lastLogin: '2024-01-14 15:30',
    testsTaken: 20,
    averageScore: '88%',
    joinDate: '2023-07-18',
  },
  {
    id: 6,
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    status: 'Inactive',
    lastLogin: '2024-01-05 13:45',
    testsTaken: 3,
    averageScore: '65%',
    joinDate: '2023-12-01',
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 10:15',
    testsTaken: 18,
    averageScore: '91%',
    joinDate: '2023-06-22',
  },
  {
    id: 8,
    name: 'Robert Lee',
    email: 'robert.lee@email.com',
    status: 'Active',
    lastLogin: '2024-01-15 17:30',
    testsTaken: 9,
    averageScore: '79%',
    joinDate: '2023-10-08',
  },
];

const columns = [
  {
    key: 'name',
    label: 'Name',
    render: (value, item) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-700">
            {value.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'testsTaken',
    label: 'Tests Taken',
  },
  {
    key: 'averageScore',
    label: 'Avg Score',
    render: (value) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (user) => {
    // Handle edit user logic
    console.log('Edit user:', user);
  };

  const handleDelete = (user) => {
    // Handle delete user logic
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.status === 'Active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-yellow-700">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Inactive Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.status === 'Inactive').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Score</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(users.reduce((acc, user) => acc + parseInt(user.averageScore), 0) / users.length)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* New Users Chart */}
          <NewUsersChart />
          
          {/* User Growth Chart */}
          <UserGrowthChart />
          
          {/* User Activity Chart */}
          <UserActivityChart />
        </div>

        {/* Users Table */}
        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          sortable={true}
        />
      </div>
    </DashboardLayout>
  );
} 