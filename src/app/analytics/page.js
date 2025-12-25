'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsMetricsCards from '@/components/analytics/AnalyticsMetricsCards';
import ScoreTrendChart from '@/components/analytics/ScoreTrendChart';
import TestCompletionRates from '@/components/analytics/TestCompletionRates';
import TopStudentsTable from '@/components/analytics/TopStudentsTable';
import ScoreDistributionChart from '@/components/analytics/ScoreDistributionChart';
import RecentActivity from '@/components/analytics/RecentActivity';
import { PERIOD_OPTIONS } from '@/constants/analytics';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  
  // Mock data for Score Trends (12 months)
  const scoreData = [
    { month: 'Jan', averageScore: 72, totalTests: 45, activeUsers: 120 },
    { month: 'Feb', averageScore: 75, totalTests: 52, activeUsers: 135 },
    { month: 'Mar', averageScore: 78, totalTests: 58, activeUsers: 148 },
    { month: 'Apr', averageScore: 80, totalTests: 64, activeUsers: 162 },
    { month: 'May', averageScore: 82, totalTests: 71, activeUsers: 175 },
    { month: 'Jun', averageScore: 85, totalTests: 78, activeUsers: 188 },
    { month: 'Jul', averageScore: 87, totalTests: 85, activeUsers: 195 },
    { month: 'Aug', averageScore: 89, totalTests: 92, activeUsers: 210 },
    { month: 'Sep', averageScore: 91, totalTests: 98, activeUsers: 225 },
    { month: 'Oct', averageScore: 88, totalTests: 105, activeUsers: 240 },
    { month: 'Nov', averageScore: 90, totalTests: 112, activeUsers: 255 },
    { month: 'Dec', averageScore: 92, totalTests: 120, activeUsers: 270 },
  ];

  // Mock data for Test Completion Rates
  const testCompletionData = [
    { test: 'TOEIC Practice Test 1', completionRate: 95, averageScore: 88 },
    { test: 'TOEIC Practice Test 2', completionRate: 92, averageScore: 85 },
    { test: 'TOEIC Practice Test 3', completionRate: 89, averageScore: 82 },
    { test: 'TOEIC Practice Test 4', completionRate: 87, averageScore: 80 },
    { test: 'TOEIC Practice Test 5', completionRate: 84, averageScore: 78 },
    { test: 'TOEIC Practice Test 6', completionRate: 91, averageScore: 86 },
    { test: 'TOEIC Practice Test 7', completionRate: 88, averageScore: 83 },
    { test: 'TOEIC Practice Test 8', completionRate: 86, averageScore: 81 },
  ];

  // Mock data for Top Performing Students
  const userProgressData = [
    { user: 'Le Si Toan', testsTaken: 45, averageScore: 95, improvement: '+12%' },
    { user: 'Tran Thi Bao Tram', testsTaken: 42, averageScore: 93, improvement: '+10%' },
    { user: 'Truong Dinh Luu', testsTaken: 38, averageScore: 91, improvement: '+8%' },
    { user: 'Huynh Vinh Tan', testsTaken: 40, averageScore: 89, improvement: '+15%' },
    { user: 'Quin', testsTaken: 35, averageScore: 87, improvement: '+7%' },
    { user: 'Con meò bò sữa', testsTaken: 33, averageScore: 85, improvement: '+9%' },
    { user: 'Vô Song', testsTaken: 30, averageScore: 83, improvement: '+6%' },
    { user: 'Lê Sĩ Toàn', testsTaken: 28, averageScore: 81, improvement: '+11%' },
    { user: 'Dinh Luu', testsTaken: 25, averageScore: 79, improvement: '+5%' },
    { user: 'Lưu Trương', testsTaken: 22, averageScore: 77, improvement: '+8%' },
  ];

  // Mock data for Score Distribution
  const scoreDistribution = [
    { range: '90-100', count: 125, percentage: 25, color: 'bg-green-500' },
    { range: '80-89', count: 200, percentage: 40, color: 'bg-blue-500' },
    { range: '70-79', count: 100, percentage: 20, color: 'bg-yellow-500' },
    { range: '60-69', count: 50, percentage: 10, color: 'bg-orange-500' },
    { range: '0-59', count: 25, percentage: 5, color: 'bg-red-500' },
  ];

  // Mock data for Recent Activity
  const recentActivity = [
    { type: 'user', action: 'Nguyen Van A completed TOEIC Practice Test 8', time: '2 minutes ago' },
    { type: 'test', action: 'New test "TOEIC Practice Test 9" was created', time: '15 minutes ago' },
    { type: 'achievement', action: 'Tran Thi B achieved 90% score milestone', time: '1 hour ago' },
    { type: 'user', action: 'Le Van C started a new practice session', time: '2 hours ago' },
    { type: 'admin', action: 'System backup completed successfully', time: '3 hours ago' },
    { type: 'user', action: 'Pham Thi D improved score by 5%', time: '4 hours ago' },
    { type: 'test', action: 'Test results updated for 15 students', time: '5 hours ago' },
    { type: 'achievement', action: 'Hoang Van E reached 50 tests milestone', time: '6 hours ago' },
    { type: 'user', action: 'Vu Thi F completed TOEIC Practice Test 7', time: '7 hours ago' },
    { type: 'system', action: 'Daily analytics report generated', time: '8 hours ago' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Analytics</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Comprehensive insights into student performance and platform usage
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-bg-card)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(91, 86, 227, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <AnalyticsMetricsCards 
          scoreData={scoreData} 
          testCompletionData={testCompletionData} 
        />

        {/* Score Trend Chart */}
        <ScoreTrendChart scoreData={scoreData} />

        {/* Test Completion Rates */}
        <TestCompletionRates testCompletionData={testCompletionData} />

        {/* Top Students Table */}
        <TopStudentsTable userProgressData={userProgressData} />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score Distribution */}
          <ScoreDistributionChart scoreDistribution={scoreDistribution} />

          {/* Recent Activity */}
          <RecentActivity recentActivity={recentActivity} />
        </div>
      </div>
    </DashboardLayout>
  );
}
