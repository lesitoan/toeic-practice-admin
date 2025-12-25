import React from 'react';

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
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      label: 'Total Tests',
      value: totalTests,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      label: 'Active Users',
      value: activeUsers,
      gradient: 'from-amber-600 to-yellow-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      gradient: 'from-purple-600 to-violet-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`card-block bg-gradient-to-br ${metric.gradient} text-white rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="p-6">
            <dl>
              <dt className="text-sm font-serif font-bold uppercase tracking-wide opacity-90 mb-2">
                {metric.label}
              </dt>
              <dd className="text-4xl font-serif font-bold">
                {metric.value}
              </dd>
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsMetricsCards;
