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
  
  // Empty data arrays - replace with API calls when ready
  const scoreData = [];
  const testCompletionData = [];
  const userProgressData = [];
  const scoreDistribution = [];
  const recentActivity = [];

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