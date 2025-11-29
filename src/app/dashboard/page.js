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
    user: 'Bé Tòn',
    action: 'Hoàn thành bài kiểm tra TOEIC 1',
    score: '85%',
    time: '2 minutes ago',
    avatar: 'TT',
  },
  {
    id: 2,
    user: 'Hòa Minzy',
    action: 'Bắt đầu TOEIC Practice Test 2',
    time: '5 minutes ago',
    avatar: 'MC',
  },
  {
    id: 3,
    user: 'Con cá',
    action: 'Hoàn thành TOEIC Practice Test 8',
    score: '92%',
    time: '12 minutes ago',
    avatar: 'CC',
  },
  {
    id: 4,
    user: 'Kim Chi',
    action: 'Đăng kí tài khoản mới',
    time: '18 minutes ago',
    avatar: 'DK',
  },
  {
    id: 5,
    user: 'Dinh Luu',
    action: 'Hoàn thành TOEIC Practice Test 3',
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
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
          <div className="card-block">
            <h3 className="card-title">Score Distribution</h3>
            <div className="space-y-3">
              {[
                { range: '90-100%', count: 234, percentage: 15, scoreClass: 'score-90-100' },
                { range: '80-89%', count: 456, percentage: 30, scoreClass: 'score-80-89' },
                { range: '70-79%', count: 567, percentage: 37, scoreClass: 'score-70-79' },
                { range: '60-69%', count: 234, percentage: 15, scoreClass: 'score-60-69' },
                { range: 'Below 60%', count: 45, percentage: 3, scoreClass: 'score-below-60' },
              ].map((item) => (
                <div key={item.range} className="flex items-center">
                  <div className="w-20 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.range}</div>
                  <div className="flex-1 mx-4">
                    <div className="progress-bar">
                      <div
                        className={`progress-bar-fill ${item.scoreClass}`}
                        style={{ width: `${item.percentage}%`, height: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-sm text-right" style={{ color: 'var(--color-text-secondary)' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-block">
            <h3 className="card-title">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5"
                          style={{ backgroundColor: 'var(--color-border)' }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" style={{ backgroundColor: 'rgba(91, 86, 227, 0.1)' }}>
                            <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{activity.avatar}</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{activity.user}</span>{' '}
                              {activity.action}
                              {activity.score && (
                                <span className="font-medium" style={{ color: 'var(--color-success)' }}> with {activity.score}</span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
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

        {/* Quick Actions */}
        <div className="card-block">
          <h3 className="card-title">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="quick-action-item"
            >
              <div className="action-icon">
                <UsersIcon className="h-7 w-7 mx-auto" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Add New User
              </h3>
              <p className="action-description mt-2">
                Create a new student account
              </p>
            </button>

            <button className="quick-action-item">
              <div className="action-icon">
                <DocumentTextIcon className="h-7 w-7 mx-auto" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Create Test
              </h3>
              <p className="action-description mt-2">
                Build a new practice test
              </p>
            </button>

            <button className="quick-action-item">
              <div className="action-icon">
                <ChartBarIcon className="h-7 w-7 mx-auto" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                View Reports
              </h3>
              <p className="action-description mt-2">
                Analyze performance data
              </p>
            </button>

            <button className="quick-action-item">
              <div className="action-icon">
                <ClockIcon className="h-7 w-7 mx-auto" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Monitor Activity
              </h3>
              <p className="action-description mt-2">
                Track real-time usage
              </p>
            </button>
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