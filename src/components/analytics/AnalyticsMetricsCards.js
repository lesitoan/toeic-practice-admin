import React from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

const AnalyticsMetricsCards = ({ scoreData = [], testCompletionData = [] }) => {
  // Calculate metrics with safe defaults for empty data
  const lastScoreData = scoreData.length > 0 ? scoreData[scoreData.length - 1] : null;
  const averageScore = lastScoreData?.averageScore ? Math.round(lastScoreData.averageScore) : 0;
  const totalTests = lastScoreData?.totalTests || 0;
  const activeUsers = lastScoreData?.activeUsers || 0;
  const completionRate = testCompletionData.length > 0
    ? Math.round(
        testCompletionData.reduce((acc, test) => acc + (test.completionRate || 0), 0) / testCompletionData.length
      )
    : 0;

  const metrics = [
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      icon: ChartBarIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Tests',
      value: totalTests,
      icon: ArrowTrendingUpIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Active Users',
      value: activeUsers,
      icon: UsersIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: ClockIcon,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {metric.label}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {metric.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsMetricsCards;
