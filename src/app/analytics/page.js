'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsMetricsCards from '@/components/analytics/AnalyticsMetricsCards';
import ScoreTrendChart from '@/components/analytics/ScoreTrendChart';
import TestCompletionRates from '@/components/analytics/TestCompletionRates';
import TopStudentsTable from '@/components/analytics/TopStudentsTable';
import ScoreDistributionChart from '@/components/analytics/ScoreDistributionChart';
import RecentActivity from '@/components/analytics/RecentActivity';
import { 
  MOCK_SCORE_DATA, 
  MOCK_TEST_COMPLETION_DATA, 
  MOCK_USER_PROGRESS_DATA, 
  MOCK_SCORE_DISTRIBUTION, 
  MOCK_RECENT_ACTIVITY, 
  PERIOD_OPTIONS 
} from '@/constants/analytics';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

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
          scoreData={MOCK_SCORE_DATA} 
          testCompletionData={MOCK_TEST_COMPLETION_DATA} 
        />

        {/* Score Trend Chart */}
        <ScoreTrendChart scoreData={MOCK_SCORE_DATA} />

        {/* Test Completion Rates */}
        <TestCompletionRates testCompletionData={MOCK_TEST_COMPLETION_DATA} />

        {/* Top Students Table */}
        <TopStudentsTable userProgressData={MOCK_USER_PROGRESS_DATA} />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score Distribution */}
          <ScoreDistributionChart scoreDistribution={MOCK_SCORE_DISTRIBUTION} />

          {/* Recent Activity */}
          <RecentActivity recentActivity={MOCK_RECENT_ACTIVITY} />
        </div>
      </div>
    </DashboardLayout>
  );
}