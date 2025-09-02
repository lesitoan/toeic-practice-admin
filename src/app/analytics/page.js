'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

// Mock data for analytics
const mockScoreData = [
  { month: 'Jan', averageScore: 75, totalTests: 120, activeUsers: 45 },
  { month: 'Feb', averageScore: 78, totalTests: 135, activeUsers: 52 },
  { month: 'Mar', averageScore: 82, totalTests: 150, activeUsers: 58 },
  { month: 'Apr', averageScore: 79, totalTests: 142, activeUsers: 55 },
  { month: 'May', averageScore: 85, totalTests: 168, activeUsers: 62 },
  { month: 'Jun', averageScore: 88, totalTests: 185, activeUsers: 68 },
  { month: 'Jul', averageScore: 86, totalTests: 172, activeUsers: 65 },
  { month: 'Aug', averageScore: 89, totalTests: 195, activeUsers: 72 },
  { month: 'Sep', averageScore: 91, totalTests: 210, activeUsers: 78 },
  { month: 'Oct', averageScore: 88, totalTests: 198, activeUsers: 75 },
  { month: 'Nov', averageScore: 92, totalTests: 225, activeUsers: 82 },
  { month: 'Dec', averageScore: 90, totalTests: 218, activeUsers: 80 },
];

const mockTestCompletionData = [
  { test: 'Test #1', completionRate: 95, averageScore: 78, totalAttempts: 45 },
  { test: 'Test #2', completionRate: 88, averageScore: 82, totalAttempts: 38 },
  { test: 'Test #3', completionRate: 92, averageScore: 85, totalAttempts: 42 },
  { test: 'Test #4', completionRate: 85, averageScore: 79, totalAttempts: 35 },
  { test: 'Test #5', completionRate: 90, averageScore: 87, totalAttempts: 40 },
];

const mockUserProgressData = [
  { user: 'Sarah Johnson', testsTaken: 12, averageScore: 85, improvement: '+12%' },
  { user: 'Michael Chen', testsTaken: 8, averageScore: 78, improvement: '+8%' },
  { user: 'Emily Rodriguez', testsTaken: 15, averageScore: 92, improvement: '+15%' },
  { user: 'David Kim', testsTaken: 5, averageScore: 72, improvement: '+5%' },
  { user: 'Lisa Thompson', testsTaken: 20, averageScore: 88, improvement: '+18%' },
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  const getMaxScore = () => Math.max(...mockScoreData.map(d => d.averageScore));
  const getMaxTests = () => Math.max(...mockScoreData.map(d => d.totalTests));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-sm text-gray-700">
              Comprehensive insights into student performance and platform usage
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="2years">Last 2 Years</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <ChartBarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(mockScoreData[mockScoreData.length - 1].averageScore)}%
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
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tests</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockScoreData[mockScoreData.length - 1].totalTests}
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
                    <UsersIcon className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockScoreData[mockScoreData.length - 1].activeUsers}
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
                    <ClockIcon className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(mockTestCompletionData.reduce((acc, test) => acc + test.completionRate, 0) / mockTestCompletionData.length)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Trend Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Score Trends Over Time</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {mockScoreData.map((data, index) => {
                const scoreHeight = (data.averageScore / getMaxScore()) * 100;
                const testHeight = (data.totalTests / getMaxTests()) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center space-x-1 mb-2">
                      <div 
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${scoreHeight}%`, width: '60%' }}
                        title={`Score: ${data.averageScore}%`}
                      />
                      <div 
                        className="bg-green-500 rounded-t"
                        style={{ height: `${testHeight}%`, width: '60%' }}
                        title={`Tests: ${data.totalTests}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                Average Score
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                Total Tests
              </div>
            </div>
          </div>
        </div>

        {/* Test Completion Rates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Completion Rates</h3>
            <div className="space-y-4">
              {mockTestCompletionData.map((test) => (
                <div key={test.test} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{test.test}</span>
                      <span className="text-sm text-gray-500">{test.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${test.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-gray-900">{test.averageScore}%</div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Progress Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Students</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tests Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUserProgressData.map((user) => (
                    <tr key={user.user} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {user.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.user}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.testsTaken}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          user.averageScore >= 90 ? 'text-green-600' :
                          user.averageScore >= 80 ? 'text-blue-600' :
                          user.averageScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {user.averageScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {user.improvement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score Distribution */}
          <div className="bg-white shadow rounded-lg">
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                  { action: 'Test completed with 92%', time: '5 minutes ago', type: 'test' },
                  { action: 'New practice test created', time: '12 minutes ago', type: 'admin' },
                  { action: 'User achieved 100% score', time: '18 minutes ago', type: 'achievement' },
                  { action: 'Monthly report generated', time: '25 minutes ago', type: 'system' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'test' ? 'bg-green-500' :
                      activity.type === 'admin' ? 'bg-purple-500' :
                      activity.type === 'achievement' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 