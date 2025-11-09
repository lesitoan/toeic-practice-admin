'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import AddUserModal from '@/components/users/AddUserModal';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

const stats = [
 
  
];

const recentActivity = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'completed TOEIC Practice Test #12',
    score: '85%',
    time: '2 minutes ago',
    avatar: 'SJ',
  },
  {
    id: 2,
    user: 'Michael Chen',
    action: 'started TOEIC Practice Test #15',
    time: '5 minutes ago',
    avatar: 'MC',
  },
  {
    id: 3,
    user: 'Emily Rodriguez',
    action: 'completed TOEIC Practice Test #8',
    score: '92%',
    time: '12 minutes ago',
    avatar: 'ER',
  },
  {
    id: 4,
    user: 'David Kim',
    action: 'registered for new account',
    time: '18 minutes ago',
    avatar: 'DK',
  },
  {
    id: 5,
    user: 'Lisa Thompson',
    action: 'completed TOEIC Practice Test #3',
    score: '76%',
    time: '25 minutes ago',
    avatar: 'LT',
  },
];

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddUser = () => {
    // User list will be refreshed when navigating to users page
    setIsAddModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your TOEIC Practice platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score Distribution Chart */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
              <div className="space-y-3">
                {[
                  { range: '90-100%', count: 234, percentage: 15, color: 'bg-green-500' },
                  { range: '80-89%', count: 456, percentage: 30, color: 'bg-blue-500' },
                  { range: '70-79%', count: 567, percentage: 37, color: 'bg-yellow-500' },
                  { range: '60-69%', count: 234, percentage: 15, color: 'bg-orange-500' },
                  { range: 'Below 60%', count: 45, percentage: 3, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.range} className="flex items-center">
                    <div className="w-20 text-sm text-gray-600">{item.range}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                              <span className="text-sm font-medium text-blue-700">{activity.avatar}</span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                                {activity.action}
                                {activity.score && (
                                  <span className="font-medium text-green-600"> with {activity.score}</span>
                                )}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="relative group bg-white p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <UsersIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    Add New User
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Create a new student account
                  </p>
                </div>
              </button>

              <button className="relative group bg-white p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <DocumentTextIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                    Create Test
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Build a new practice test
                  </p>
                </div>
              </button>

              <button className="relative group bg-white p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <ChartBarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                    View Reports
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Analyze performance data
                  </p>
                </div>
              </button>

              <button className="relative group bg-white p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                    <ClockIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">
                    Monitor Activity
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Track real-time usage
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddUser}
        />
      </div>
    </DashboardLayout>
  );
} 