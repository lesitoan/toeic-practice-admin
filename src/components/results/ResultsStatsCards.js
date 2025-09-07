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
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <span className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.icon}
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
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

export default ResultsStatsCards;
