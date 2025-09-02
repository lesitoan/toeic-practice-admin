'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

// Mock data for tests
const mockTests = [
  {
    id: 1,
    title: 'TOEIC Practice Test #1 - Listening & Reading',
    category: 'Listening & Reading',
    difficulty: 'Intermediate',
    duration: '120 min',
    questions: 200,
    status: 'Published',
    assignedUsers: 45,
    averageScore: '78%',
    createdAt: '2024-01-10',
    lastModified: '2024-01-15',
  },
  {
    id: 2,
    title: 'TOEIC Practice Test #2 - Speaking & Writing',
    category: 'Speaking & Writing',
    difficulty: 'Advanced',
    duration: '80 min',
    questions: 8,
    status: 'Draft',
    assignedUsers: 0,
    averageScore: 'N/A',
    createdAt: '2024-01-12',
    lastModified: '2024-01-14',
  },
  {
    id: 3,
    title: 'TOEIC Practice Test #3 - Full Test',
    category: 'Full Test',
    difficulty: 'Intermediate',
    duration: '200 min',
    questions: 208,
    status: 'Published',
    assignedUsers: 67,
    averageScore: '82%',
    createdAt: '2024-01-05',
    lastModified: '2024-01-10',
  },
  {
    id: 4,
    title: 'TOEIC Practice Test #4 - Listening Focus',
    category: 'Listening',
    difficulty: 'Beginner',
    duration: '60 min',
    questions: 100,
    status: 'Published',
    assignedUsers: 23,
    averageScore: '75%',
    createdAt: '2024-01-08',
    lastModified: '2024-01-12',
  },
  {
    id: 5,
    title: 'TOEIC Practice Test #5 - Reading Focus',
    category: 'Reading',
    difficulty: 'Advanced',
    duration: '75 min',
    questions: 100,
    status: 'Published',
    assignedUsers: 34,
    averageScore: '85%',
    createdAt: '2024-01-03',
    lastModified: '2024-01-08',
  },
];

const columns = [
  {
    key: 'title',
    label: 'Test Title',
    render: (value, item) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{item.category}</div>
      </div>
    ),
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Beginner' ? 'bg-green-100 text-green-800' :
        value === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
  },
  {
    key: 'questions',
    label: 'Questions',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'assignedUsers',
    label: 'Assigned Users',
  },
  {
    key: 'averageScore',
    label: 'Avg Score',
    render: (value) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

export default function Tests() {
  const [tests, setTests] = useState(mockTests);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (test) => {
    // Handle edit test logic
    console.log('Edit test:', test);
  };

  const handleDelete = (test) => {
    // Handle delete test logic
    if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
      setTests(tests.filter(t => t.id !== test.id));
    }
  };

  const handleView = (test) => {
    // Handle view test logic
    console.log('View test:', test);
  };

  const handleAssign = (test) => {
    // Handle assign test logic
    console.log('Assign test:', test);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage TOEIC practice tests for your students
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Test
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tests</dt>
                    <dd className="text-lg font-medium text-gray-900">{tests.length}</dd>
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
                    <span className="text-sm font-medium text-green-700">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tests.filter(t => t.status === 'Published').length}
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
                    <span className="text-sm font-medium text-yellow-700">D</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tests.filter(t => t.status === 'Draft').length}
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
                    <span className="text-sm font-medium text-purple-700">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tests.reduce((acc, test) => acc + test.assignedUsers, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {tests.length} tests found
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(test[column.key], test) : test[column.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(test)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(test)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAssign(test)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleDelete(test)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 