import React from 'react';

const ResultsStatsCards = ({ results }) => {
  // Calculate statistics
  const totalResults = results.length;
  const averageScore = Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length);
  const highestScore = Math.max(...results.map(r => r.score));
  const uniqueStudents = new Set(results.map(r => r.student)).size;

  const stats = [
    {
      label: 'Total Results',
      value: totalResults,
      icon: 'T',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      icon: 'A',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Highest Score',
      value: `${highestScore}%`,
      icon: 'H',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Students',
      value: uniqueStudents,
      icon: 'S',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="card-block">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 86, 227, 0.1)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  {stat.icon}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </dt>
                <dd className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {stat.value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsStatsCards;
