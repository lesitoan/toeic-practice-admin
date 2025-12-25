import React from 'react';

const ResultsStatsCards = ({ results }) => {
  // Calculate statistics
  const totalResults = results.length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)
    : 0;
  const highestScore = results.length > 0 
    ? Math.max(...results.map(r => r.score))
    : 0;
  const uniqueStudents = results.length > 0 
    ? new Set(results.map(r => r.student)).size
    : 0;

  const stats = [
    {
      label: 'Total Results',
      value: totalResults,
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      gradient: 'from-lime-500 to-green-600'
    },
    {
      label: 'Highest Score',
      value: `${highestScore}%`,
      gradient: 'from-amber-500 to-yellow-600'
    },
    {
      label: 'Students',
      value: uniqueStudents,
      gradient: 'from-fuchsia-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`card-block bg-gradient-to-br ${stat.gradient} text-white rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="p-6">
            <dl>
              <dt className="text-sm font-serif font-bold uppercase tracking-wide opacity-90 mb-2">
                {stat.label}
              </dt>
              <dd className="text-4xl font-serif font-bold">
                {stat.value}
              </dd>
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsStatsCards;
